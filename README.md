# Local provider
> Visit http://anyfetch.com for details about AnyFetch.

## You need...
* MongoDB
* Node
* A set of keys (ask support@anyfetch.com)

## How to?
After cloning and running `npm install`, source your keys:

``` bash
source ./keys.sh
```

And start your server:

```bash
node bin/server
```

Now go to `settings.anyfetch.com`, and click on "Connect Localdata".
A new page will popup, enter the absolute path to the files you want to sync with anyFetch (subfolders will be synced too).

Now open a shell, fire `mongo`:
``` bash
use anyfetch-provider
db.tokens.find()
```

Copy the last value for `anyfetchToken`, for instance:

```json
{ "anyfetchToken" : "09710ea376b0c5a6e8fb739f5071e5667e16d0dd25e5e0474f53a18d4b0606f6", "datas" : { "path" : "/path/to/data/to/provide" }, "_id" : ObjectId("533c3e084256f8530af71dd4"), "lastUpdate" : null, "isUpdating" : false, "__v" : 0 }
```

Our token will be `09710ea376b0c5a6e8fb739f5071e5667e16d0dd25e5e0474f53a18d4b0606f6`.

You're nearly done!
Let's send a request to our local provider:

```
curl -XPOST "http://localhost:8000/update?access_token=${TOKEN}&api_url=http://api.anyfetch.com"
```

You're done ! In the `node` shell you should now see the logs.

Support: `support@anyfetch.com`.
