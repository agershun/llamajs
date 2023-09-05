# Llama2.c port to JavaScript

This is a JavaScript version of the popular [llama2.c](https://github.com/karpathy/llama2.c) library by Andrej Karpathy.

Place the model file (e.g. [stories15M.bin]()) into the directory.
```sh
wget https://huggingface.co/karpathy/tinyllamas/resolve/main/stories15M.bin
```

Then run the LLM.

```sh
> node src/main.js stories15M.bin -i "Tell me a story "
```

## License
MIT