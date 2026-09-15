from html.parser import HTMLParser
import sys

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        
    def handle_starttag(self, tag, attrs):
        if tag not in ['img', 'br', 'hr', 'input', 'source']:
            self.stack.append((tag, self.getpos()))
            
    def handle_endtag(self, tag):
        if tag not in ['img', 'br', 'hr', 'input', 'source']:
            if not self.stack:
                print(f"Error: unexpected closing tag {tag} at {self.getpos()}")
                return
            last_tag, pos = self.stack.pop()
            if last_tag != tag:
                print(f"Error: mismatched tag {last_tag} at {pos} closed by {tag} at {self.getpos()}")

with open('components/vendors/booking/BookingFlow.vue', 'r') as f:
    parser = MyHTMLParser()
    parser.feed(f.read())
    for tag, pos in self.stack:
        print(f"Unclosed tag: {tag} at {pos}")
