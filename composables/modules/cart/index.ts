import { ref, computed } from 'vue';
import { useVendors } from '@/composables/modules/vendors';
import { useCustomToast } from '@/composables/core/useCustomToast';

interface CartItem {
  productId: string;
  vendorId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations: { name: string; selected: string; price: number }[];
  subtotal: number;
  isPrepaidByPlatform?: boolean;
}

interface Pack {
  id: string;
  name?: string;
  packType?: { name: string; price: number };
  items: CartItem[];
}

// Global state (Singleton Pattern)
const carts = ref<Record<string, { packs: Pack[]; activePackId: string }>>({});
const vendorNotes = ref<Record<string, string>>({});
const deliveryAddress = ref('');
const deliveryNotes = ref('');
const deliveryLocation = ref<{ type: string; coordinates: number[] } | null>(null);
const cartInitialized = ref(false);

let packCounter = 0;

const generatePackId = () => {
  packCounter++;
  return `pack_${Date.now()}_${packCounter}`;
};

export const useCart = () => {
  const initCart = () => {
    if (cartInitialized.value || !import.meta.client) return;
    const stored = localStorage.getItem('errandr_cart_multi_v1');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        carts.value = parsed.carts || {};
        vendorNotes.value = parsed.vendorNotes || {};
        packCounter = parsed.packCounter || 0;
      } catch (e) {
        console.error('Failed to parse stored cart', e);
      }
    }
    cartInitialized.value = true;
  };

  const saveToStorage = () => {
    if (import.meta.client) {
      localStorage.setItem('errandr_cart_multi_v1', JSON.stringify({
        carts: carts.value,
        vendorNotes: vendorNotes.value,
        packCounter,
      }));
    }
  };

  const ensureVendorCart = (vendorId: string) => {
    if (!carts.value[vendorId]) {
      const pId = generatePackId();
      carts.value[vendorId] = {
        packs: [{ id: pId, items: [] }],
        activePackId: pId,
      };
    }
    return carts.value[vendorId];
  };

  const addItem = (item: Omit<CartItem, 'subtotal'>) => {
    const { vendorsMetadata } = useVendors();
    const { showToast } = useCustomToast();

    // Prevent multi-vendor checkout by ensuring only one vendor in cart
    const otherVendorIds = allVendorIds.value.filter(id => id !== item.vendorId);
    if (otherVendorIds.length > 0) {
      showToast({
        title: 'Cart Conflict',
        message: 'You can only order from one vendor at a time. Please clear or checkout your current cart first.',
        toastType: 'error'
      });
      return;
    }

    const vCart = ensureVendorCart(item.vendorId);
    
    let activePack = vCart.packs.find(p => p.id === vCart.activePackId);
    if (!activePack) {
      activePack = vCart.packs[0];
      vCart.activePackId = activePack.id;
    }

    const existingIndex = activePack.items.findIndex(
      (i) =>
        i.productId === item.productId &&
        JSON.stringify(i.customizations) === JSON.stringify(item.customizations),
    );

    if (existingIndex !== -1) {
      activePack.items[existingIndex].quantity += item.quantity;
      const customTotal = (activePack.items[existingIndex].customizations || []).reduce((s: number, c: any) => s + (c.price || 0), 0);
      activePack.items[existingIndex].subtotal =
        (activePack.items[existingIndex].price + customTotal) * activePack.items[existingIndex].quantity;
    } else {
      const customTotal = (item.customizations || []).reduce((s: number, c: any) => s + (c.price || 0), 0);
      activePack.items.push({
        ...item,
        customizations: item.customizations || [],
        subtotal: (item.price + customTotal) * item.quantity,
      });
    }

    saveToStorage();
  };

  const addPack = (vendorId: string) => {
    const vCart = ensureVendorCart(vendorId);
    const id = generatePackId();
    vCart.packs.push({ id, items: [] });
    vCart.activePackId = id;
    saveToStorage();
  };

  const duplicatePack = (vendorId: string, packId: string) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    const sourcePack = vCart.packs.find(p => p.id === packId);
    if (!sourcePack || sourcePack.items.length === 0) return;

    const newId = generatePackId();
    const clonedItems = JSON.parse(JSON.stringify(sourcePack.items));
    vCart.packs.push({ id: newId, items: clonedItems, name: sourcePack.name, packType: sourcePack.packType ? { ...sourcePack.packType } : undefined });
    vCart.activePackId = newId;
    saveToStorage();
  };

  const removePack = (vendorId: string, packId: string) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    vCart.packs = vCart.packs.filter(p => p.id !== packId);
    if (vCart.activePackId === packId) {
      vCart.activePackId = vCart.packs[0]?.id || '';
    }
    if (vCart.packs.length === 0) {
      delete carts.value[vendorId];
    }
    saveToStorage();
  };

  const setActivePack = (vendorId: string, packId: string) => {
    if (carts.value[vendorId]) {
      carts.value[vendorId].activePackId = packId;
    }
  };

  const renamePack = (vendorId: string, packId: string, name: string) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    const pack = vCart.packs.find(p => p.id === packId);
    if (!pack) return;
    pack.name = name;
    saveToStorage();
  };

  const setPackType = (vendorId: string, packId: string, packType: { name: string; price: number }) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    const pack = vCart.packs.find(p => p.id === packId);
    if (!pack) return;
    pack.packType = packType;
    pack.name = packType.name;
    // Force reactivity update
    carts.value = { ...carts.value };
    saveToStorage();
  };

  const removeItemFromPack = (vendorId: string, packId: string, itemIndex: number) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    const pack = vCart.packs.find(p => p.id === packId);
    if (!pack) return;
    pack.items.splice(itemIndex, 1);
    if (pack.items.length === 0) {
      removePack(vendorId, packId);
    } else {
      saveToStorage();
    }
  };

  const updateItemQuantity = (vendorId: string, packId: string, itemIndex: number, quantity: number) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return;
    const pack = vCart.packs.find(p => p.id === packId);
    if (!pack || !pack.items[itemIndex]) return;

    if (quantity <= 0) {
      removeItemFromPack(vendorId, packId, itemIndex);
      return;
    }

    pack.items[itemIndex].quantity = quantity;
    const customTotal = (pack.items[itemIndex].customizations || []).reduce((s: number, c: any) => s + (c.price || 0), 0);
    pack.items[itemIndex].subtotal = (pack.items[itemIndex].price + customTotal) * pack.items[itemIndex].quantity;
    saveToStorage();
  };

  const clearCart = (vendorId?: string) => {
    if (vendorId) {
      delete carts.value[vendorId];
    } else {
      carts.value = {};
      vendorNotes.value = {};
      deliveryAddress.value = '';
      deliveryNotes.value = '';
      deliveryLocation.value = null;
    }
    saveToStorage();
  };

  // Computed
  const allVendorIds = computed(() => Object.keys(carts.value).filter(vId => carts.value[vId].packs.some(p => p.items.length > 0)));
  const allPacks = computed(() => Object.values(carts.value).flatMap(c => c.packs));
  const allItems = computed(() => allPacks.value.flatMap(p => p.items));
  
  const itemCount = computed(() => allItems.value.reduce((sum, item) => sum + item.quantity, 0));
  const subtotal = computed(() => allItems.value.reduce((sum, item) => sum + item.subtotal, 0));
  
  // Fees are per-vendor now. We'll provide a helper to get fees for a specific vendor
  const getVendorStats = (vendorId: string) => {
    const vCart = carts.value[vendorId];
    if (!vCart) return { subtotal: 0, itemCount: 0, packs: [], packagingFee: 0, serviceFee: 0 };
    const items = vCart.packs.flatMap(p => p.items);
    const sub = items.reduce((sum, item) => sum + item.subtotal, 0);
    const pFee = vCart.packs.reduce((sum, p) => sum + (p.packType?.price || 0), 0);
    return {
      subtotal: sub,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      packs: vCart.packs,
      packagingFee: pFee,
      serviceFee: 0,
    };
  };

  const total = computed(() => {
    let t = 0;
    allVendorIds.value.forEach(vId => {
      const stats = getVendorStats(vId);
      t += stats.subtotal + stats.packagingFee + stats.serviceFee;
    });
    return t;
  });

  const isEmpty = computed(() => allVendorIds.value.length === 0);

  // Helper for the vendor detail page (id.vue)
  const getPacksByVendor = (vendorId: string) => computed(() => carts.value[vendorId]?.packs || []);
  const getActivePackByVendor = (vendorId: string) => computed(() => {
    const vCart = carts.value[vendorId];
    return vCart?.packs.find(p => p.id === vCart.activePackId) || null;
  });

  return {
    carts,
    allVendorIds,
    allPacks,
    allItems,
    addItem,
    clearCart,
    initCart,
    itemCount,
    subtotal,
    total,
    isEmpty,
    getVendorStats,
    getPacksByVendor,
    getActivePackByVendor,
    addPack,
    duplicatePack,
    removePack,
    renamePack,
    setPackType,
    setActivePack,
    removeItemFromPack,
    updateItemQuantity,
    deliveryAddress,
    deliveryNotes,
    vendorNotes,
    deliveryLocation,
    saveToStorage,
  };
};

