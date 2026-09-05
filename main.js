window.acode.setPlugin("acode_emmet", async (server, $page, { cacheFile, storage }) => {
  class AcodeEmmet {
    async init() {
      this.editorManager = window.editorManager;
      if (!this.editorManager) return;

      this.editor = this.editorManager.editor;
      
      if (window.ace && window.ace.require) {
        try {
          const langTools = window.ace.require("ace/ext/language_tools");
          
          const emmetCompleter = {
            getCompletions: (editor, session, pos, prefix, callback) => {
              if (!prefix || prefix.length < 1) {
                return callback(null, []);
              }

              const expanded = this.parseEmmet(prefix);
              if (!expanded) {
                return callback(null, []);
              }

              callback(null, [{
                caption: prefix,
                value: expanded,
                meta: "Emmet",
                score: 1000
              }]);
            }
          };

          langTools.addCompleter(emmetCompleter);
        } catch (e) {
          console.error("Failed to load Ace language tools for Emmet", e);
        }
      }

      window.toast("Emmet autocomplete active!");
    }

    parseEmmet(abbr) {
      // Boilerplate
      if (abbr === "html:5" || abbr === "!") {
        return `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>Document</title>\n</head>\n<body>\n\t\n</body>\n</html>`;
      }

      // Class shorthand
      const classMatch = abbr.match(/^([a-zA-Z0-9]*)\.([\w\-]+)$/);
      if (classMatch) {
        const tag = classMatch[1] || "div";
        const cls = classMatch[2];
        return `<${tag} class="${cls}"></${tag}>`;
      }

      // ID shorthand
      const idMatch = abbr.match(/^([a-zA-Z0-9]*)\#([\w\-]+)$/);
      if (idMatch) {
        const tag = idMatch[1] || "div";
        const id = idMatch[2];
        return `<${tag} id="${id}"></${tag}>`;
      }

      // Basic tag wrapping
      if (/^[a-zA-Z]+$/.test(abbr)) {
        return `<${abbr}></${abbr}>`;
      }

      return null;
    }

    async destroy() {
    }
  }

  const emmetPlugin = new AcodeEmmet();
  emmetPlugin.init();
});
