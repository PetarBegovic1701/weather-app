// console.log = () => {}
// console.warn = () => {}
// console.error = () => {}
global._babelPolyfill = false; // QFIX: Uncaught Error: only one instance of babel-polyfill is allowed

import React from "react";
import ReactDOM from "react-dom";
import App from "./js/components/App.js";
// No need for now
// import CssBaseline from '@material-ui/core/CssBaseline';

ReactDOM.render(

	<App />, document.getElementById("app")

);


