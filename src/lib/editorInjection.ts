/**
 * Script injected into the portfolio iframe to enable inline WYSIWYG editing.
 * Communicates with parent via postMessage.
 */
export function getEditorInjectionScript(): string {
  return `
<style id="__editor-styles">
  .__editor-toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    background: #1e293b;
    color: #f8fafc;
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 6px 12px;
    font-family: system-ui, sans-serif;
    font-size: 13px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
    flex-wrap: wrap;
    overflow-x: auto;
  }
  .__editor-toolbar button {
    background: transparent;
    border: 1px solid transparent;
    color: #cbd5e1;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-family: system-ui, sans-serif;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .__editor-toolbar button:hover {
    background: #334155;
    color: #f8fafc;
    border-color: #475569;
  }
  .__editor-toolbar button.active {
    background: #3b82f6;
    color: #fff;
  }
  .__editor-sep {
    width: 1px;
    height: 20px;
    background: #475569;
    margin: 0 4px;
    flex-shrink: 0;
  }
  .__editor-toolbar .editor-label {
    font-weight: 600;
    color: #3b82f6;
    margin-right: 8px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    flex-shrink: 0;
  }
  .__editable-highlight {
    outline: 2px dashed #3b82f680 !important;
    outline-offset: 2px;
    cursor: text;
  }
  body.__editing-mode {
    padding-top: 50px !important;
  }
  .__img-overlay {
    position: absolute;
    display: none;
    background: rgba(30,41,59,0.8);
    color: #f8fafc;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    z-index: 99998;
    font-family: system-ui, sans-serif;
  }
  @media(max-width:768px) {
    .__editor-toolbar {
      padding: 4px 8px;
      gap: 1px;
    }
    .__editor-toolbar button {
      padding: 4px 6px;
      font-size: 12px;
    }
    .__editor-sep {
      margin: 0 2px;
    }
  }
</style>

<div class="__editor-toolbar" id="__editor-toolbar">
  <span class="editor-label">Editor</span>
  <button onclick="document.execCommand('bold')" title="Bold"><b>B</b></button>
  <button onclick="document.execCommand('italic')" title="Italic"><i>I</i></button>
  <button onclick="document.execCommand('underline')" title="Underline"><u>U</u></button>
  <div class="__editor-sep"></div>
  <button onclick="__editorFontSize(-1)" title="Decrease Font">A-</button>
  <button onclick="__editorFontSize(1)" title="Increase Font">A+</button>
  <div class="__editor-sep"></div>
  <button onclick="__editorChangeColor()" title="Text Color">Color</button>
  <button onclick="__editorAddLink()" title="Add Link">Link</button>
  <div class="__editor-sep"></div>
  <button onclick="__editorAddText()" title="Add Text Block">+Text</button>
  <div class="__editor-sep"></div>
  <button onclick="__editorUndo()" title="Undo">Undo</button>
  <button onclick="__editorRedo()" title="Redo">Redo</button>
</div>

<script>
(function() {
  document.body.classList.add('__editing-mode');
  
  var editableSelectors = 'h1, h2, h3, h4, h5, h6, p, span, li, td, th, a, label, div:not([class*="__editor"])';
  
  function makeEditable() {
    document.querySelectorAll(editableSelectors).forEach(function(el) {
      if (el.closest('#__editor-toolbar') || el.closest('.__editor-toolbar')) return;
      if (el.children.length === 0 || el.textContent.trim().length > 0) {
        el.setAttribute('contenteditable', 'true');
        el.addEventListener('focus', function() {
          this.classList.add('__editable-highlight');
        });
        el.addEventListener('blur', function() {
          this.classList.remove('__editable-highlight');
          __editorNotifyParent();
        });
      }
    });
  }
  makeEditable();

  document.querySelectorAll('img').forEach(function(img) {
    img.style.cursor = 'pointer';
    img.title = 'Click to replace image';
    img.addEventListener('click', function(e) {
      e.preventDefault();
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = function(ev) {
        var file = ev.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(r) {
          img.src = r.target.result;
          __editorNotifyParent();
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  });

  window.__editorFontSize = function(dir) {
    var sel = window.getSelection();
    if (!sel.rangeCount) return;
    var el = sel.anchorNode.parentElement || sel.anchorNode;
    var current = parseFloat(window.getComputedStyle(el).fontSize);
    el.style.fontSize = (current + dir * 2) + 'px';
    __editorNotifyParent();
  };

  window.__editorChangeColor = function() {
    var color = prompt('Enter a color (hex or name):', '#000000');
    if (color) document.execCommand('foreColor', false, color);
    __editorNotifyParent();
  };

  window.__editorAddLink = function() {
    var url = prompt('Enter URL:');
    if (url) document.execCommand('createLink', false, url);
    __editorNotifyParent();
  };

  window.__editorAddImage = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(ev) {
      var file = ev.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(r) {
        var img = document.createElement('img');
        img.src = r.target.result;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        img.style.margin = '16px 0';
        var sel = window.getSelection();
        if (sel.rangeCount) {
          var range = sel.getRangeAt(0);
          range.insertNode(img);
        } else {
          var main = document.querySelector('main') || document.body;
          main.appendChild(img);
        }
        __editorNotifyParent();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  window.__editorAddText = function() {
    var text = prompt('Enter text to add:');
    if (!text) return;
    var p = document.createElement('p');
    p.textContent = text;
    p.setAttribute('contenteditable', 'true');
    p.style.margin = '12px 0';
    p.addEventListener('focus', function() { this.classList.add('__editable-highlight'); });
    p.addEventListener('blur', function() { this.classList.remove('__editable-highlight'); __editorNotifyParent(); });
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var range = sel.getRangeAt(0);
      range.insertNode(p);
    } else {
      var main = document.querySelector('main') || document.body;
      main.appendChild(p);
    }
    __editorNotifyParent();
  };

  window.__editorUndo = function() { document.execCommand('undo'); __editorNotifyParent(); };
  window.__editorRedo = function() { document.execCommand('redo'); __editorNotifyParent(); };

  window.__editorNotifyParent = function() {
    var clone = document.documentElement.cloneNode(true);
    var toolbar = clone.querySelector('#__editor-toolbar');
    if (toolbar) toolbar.remove();
    var styles = clone.querySelector('#__editor-styles');
    if (styles) styles.remove();
    var scripts = clone.querySelectorAll('script');
    scripts.forEach(function(s) { if (s.textContent.includes('__editor')) s.remove(); });
    clone.querySelectorAll('[contenteditable]').forEach(function(el) { el.removeAttribute('contenteditable'); });
    clone.querySelectorAll('.__editable-highlight').forEach(function(el) { el.classList.remove('__editable-highlight'); });
    var body = clone.querySelector('body');
    if (body) body.classList.remove('__editing-mode');
    
    window.parent.postMessage({ type: '__editor_update', html: '<!DOCTYPE html>' + clone.outerHTML }, '*');
  };

  window.parent.postMessage({ type: '__editor_ready' }, '*');
})();
</script>`;
}

/**
 * Inject editor into existing HTML string
 */
export function injectEditor(html: string): string {
  const injection = getEditorInjectionScript();
  if (html.includes('</body>')) {
    return html.replace('</body>', injection + '</body>');
  }
  return html + injection;
}

/**
 * Strip editor artifacts from HTML
 */
export function stripEditor(html: string): string {
  return html
    .replace(/<style id="__editor-styles">[\s\S]*?<\/style>/g, '')
    .replace(/<div class="__editor-toolbar"[\s\S]*?<\/div>\s*<script>[\s\S]*?<\/script>/g, '')
    .replace(/\s*contenteditable="true"/g, '')
    .replace(/\s*class="__editable-highlight"/g, '')
    .replace(/\s*class="__editing-mode"/g, '');
}
