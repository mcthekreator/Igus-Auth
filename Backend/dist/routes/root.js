"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.root = root;
function root(req, res) {
    res.status(200).send("<h1>Express server is up and running </h1>");
}
