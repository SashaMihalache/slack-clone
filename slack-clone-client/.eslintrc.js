module.exports = {
    "extends": ["airbnb", "prettier"],
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "globals": {
        "document": 1
    },
    "rules": {
        "react/jsx-filename-extension": 0,
        "react/prop-types": 0
    },
    "parser": "babel-eslint",
    "env": {
        "browser": 1
    }
};