# Config

Rename `config/config.example.json` to `config/config.json` and change the contents. It should look like this:

```json
{
    "url": "https://example.com/vote",
    "categories": {
        "category 1": {
            "images": 5
        },
        "another category": {
            "images": 3
        },
        "others": {
            "images": 10
        }
    }
}
```

Any number of categories can be created with any number of images. The `url` parameter is used for convenience in the token generation message.

# Data

There are three main directories where the program stores and expects its data, all should be next to the main binary (`sdvote`). The images themselves should be put in the `images` directory, config in `config`, and `data` should be empty initially (that's for the sqlite database).

# Images

They're expected to be put at `images/category name/1.jpg`, where `category name` is taken from the config, and `1.jpg` is the first image name (`2.jpg` for the second and so on). This file name format is strict but the file contents are not checked so they can be PNGs or WEBPs as well. As long as browsers accept it. It's your job to ensure the number of actual images in a category corresponds to the number in the config.

# Tokens

Voting tokens can be created by running the program with arguments:

-   `-a` to create a regular voting token
-   `-r` to create a result-watching token (the link to the result page will be printed if the `url` parameter is set in config)
-   `-c` to deactivate all remaining tokens and stop voting

If you need to reactivate a token you can do so manually with `sqlite3` for now. The schema is simple enough. If the need arises I might add more options to remove the votes and reset the token.

# Results

The results page can be accessed at `/results?token=yourResultToken` (relative to the app root)
