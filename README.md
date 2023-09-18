# Llamajs

This is a JavaScript version of the popular [llama2.c](https://github.com/karpathy/llama2.c) library by Andrej Karpathy.

Place a model file (e.g. [stories15M.bin](https://huggingface.co/karpathy/tinyllamas/resolve/main/stories15M.bin)) into the directory.
```sh
wget https://huggingface.co/karpathy/tinyllamas/resolve/main/stories15M.bin
```

Then run the LLM.

```sh
> node src/main.js stories15M.bin -i "Tell me a story "
```

The repo is not yet on npm, byt if you prefer to run from outside of the repo you can install it globally via npm

```sh
> npm install -g https://github.com/agershun/llamajs
> llamajs stories15M.bin -i "Tell me a story "
```


## License
MIT
