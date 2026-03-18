const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
    const isProd = argv.mode === "production";

    return {
        mode: isProd ? "production" : "development",
        entry: "./src/index.js",
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, "dist"),
            clean: true,

            // GitHub Pages serves your site at /<repo-name>/, not /
            // Replace YOUR_REPO_NAME with the actual repo name.
            publicPath: isProd ? "/odin-todolist/" : "/",
        },
        devServer: {
            static: "./dist",
            port: 8080,
            open: true,
            hot: true,
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: "asset/resource",
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/template.html",
            }),
        ],
    };
};