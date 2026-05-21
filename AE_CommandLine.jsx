/* AE Command Line.jsx
   ScriptUI command runner for After Effects
*/

(function AECommandLine(thisObj) {

    var SCRIPT_NAME = "AE Command Line";
    var TEMP_FOLDER_NAME = "AE_CommandLine_Temp";
    var HISTORY_FILE_NAME = "history_index.txt";
    var MAX_HISTORY = 200;

    var tempFolder = new Folder(Folder.temp.fsName + "/" + TEMP_FOLDER_NAME);
    if (!tempFolder.exists) tempFolder.create();

    var historyFile = new File(tempFolder.fsName + "/" + HISTORY_FILE_NAME);

    var history = [];
    var historyPos = -1;

    function pad(num, size) {
        var s = String(num);
        while (s.length < size) s = "0" + s;
        return s;
    }

    function timestampName() {
        var d = new Date();
        return "cmd_" +
            d.getFullYear() +
            pad(d.getMonth() + 1, 2) +
            pad(d.getDate(), 2) + "_" +
            pad(d.getHours(), 2) +
            pad(d.getMinutes(), 2) +
            pad(d.getSeconds(), 2) + "_" +
            pad(d.getMilliseconds(), 3) +
            ".jsx";
    }

    function readText(file) {
        if (!file.exists) return "";
        file.encoding = "UTF-8";
        file.open("r");
        var txt = file.read();
        file.close();
        return txt;
    }

    function writeText(file, text) {
        file.encoding = "UTF-8";
        file.open("w");
        file.write(text);
        file.close();
    }

    function loadHistory() {
        history = [];

        if (!historyFile.exists) return;

        var raw = readText(historyFile);
        var lines = raw.split(/\r\n|\n|\r/);

        for (var i = 0; i < lines.length; i++) {
            var name = lines[i];
            if (name && name !== "") {
                var f = new File(tempFolder.fsName + "/" + name);
                if (f.exists) history.push(name);
            }
        }

        historyPos = history.length;
    }

    function saveHistory() {
        while (history.length > MAX_HISTORY) {
            var oldName = history.shift();
            var oldFile = new File(tempFolder.fsName + "/" + oldName);
            if (oldFile.exists) oldFile.remove();
        }

        writeText(historyFile, history.join("\n"));
        historyPos = history.length;
    }

    function saveCommand(code) {
        var name = timestampName();
        var file = new File(tempFolder.fsName + "/" + name);

        writeText(file, code);

        history.push(name);
        saveHistory();

        return file;
    }

    function getHistoryCode(offset) {
        if (history.length < 1) return "";

        historyPos += offset;

        if (historyPos < 0) historyPos = 0;
        if (historyPos > history.length) historyPos = history.length;

        if (historyPos === history.length) return "";

        var file = new File(tempFolder.fsName + "/" + history[historyPos]);
        return readText(file);
    }

    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", SCRIPT_NAME, undefined, { resizeable: true });

        win.orientation = "column";
        win.alignChildren = ["fill", "fill"];

        var input = win.add("edittext", undefined, "", {
            multiline: true,
            scrolling: true
        });
        input.preferredSize = [600, 260];

        var btnGroup = win.add("group");
        btnGroup.orientation = "row";
        btnGroup.alignChildren = ["left", "center"];

        var runBtn = btnGroup.add("button", undefined, "Run");
        var prevBtn = btnGroup.add("button", undefined, "▲ History");
        var nextBtn = btnGroup.add("button", undefined, "▼ History");
        var clearBtn = btnGroup.add("button", undefined, "Clear");

        var output = win.add("edittext", undefined, "", {
            multiline: true,
            scrolling: true,
            readonly: true
        });
        output.preferredSize = [600, 160];

        function log(msg) {
            output.text += msg + "\n";
            output.active = true;
        }

        function runCommand() {
            var code = input.text;

            if (!code || code === "") {
                log("Nothing to run.");
                return;
            }

            var file = saveCommand(code);

            log("----------------------------------------");
            log("Saved:");
            log(file.fsName);
            log("Running...");

            app.beginUndoGroup("AE Command Line Execution");

            try {
                var result = $.evalFile(file);

                if (result !== undefined) {
                    log("Result:");
                    log(String(result));
                } else {
                    log("Done.");
                }

            } catch (err) {
                log("ERROR:");
                log("Line: " + err.line);
                log(String(err));
            }

            app.endUndoGroup();
        }

        runBtn.onClick = runCommand;

        prevBtn.onClick = function () {
            input.text = getHistoryCode(-1);
            input.active = true;
        };

        nextBtn.onClick = function () {
            input.text = getHistoryCode(1);
            input.active = true;
        };

        clearBtn.onClick = function () {
            input.text = "";
            input.active = true;
        };

        input.addEventListener("keydown", function (k) {
            if (k.keyName === "Up") {
                input.text = getHistoryCode(-1);
                k.preventDefault();
            }

            if (k.keyName === "Down") {
                input.text = getHistoryCode(1);
                k.preventDefault();
            }

            if (k.keyName === "Enter" && k.ctrlKey) {
                runCommand();
                k.preventDefault();
            }
        });

        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };

        loadHistory();

        win.layout.layout(true);
        return win;
    }

    var ui = buildUI(thisObj);

    if (ui instanceof Window) {
        ui.center();
        ui.show();
    }

})(this);