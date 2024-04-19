import React, { useEffect, useState } from "react";
import {EditorView, basicSetup, minimalSetup} from "codemirror";
import {javascript} from "@codemirror/lang-javascript"
import {EditorState, Compartment} from "@codemirror/state"
import {keymap} from "@codemirror/view";



// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/dracula.css';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';

const Editor = () => {
    const [value, setValue ] = useState('');

    useEffect(() => {
        const startState = EditorState.create({
            doc: value,
            extensions: [
                basicSetup,
                javascript(),
                keymap.of(['defaultKeymap']) // Add any keybindings if needed
            ]
        });

        new EditorView({
            state: startState,
            parent: document.getElementById("realtimeEditor")
        });

        // setValue(document.getElementById('realtimeEditor').value);
        // console.log(value);
    }, []);

    return <h2 id="realtimeEditor"></h2>
}

export default Editor;