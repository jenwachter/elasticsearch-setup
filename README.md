# Elasticsearch setup

Reads settings from files and sets up an elasticsearch node. Currently supports aliases, index settings, and type mapping.

## Usage

```bash
$ essetup [host] [settingsDir] [--user=username] [--pass=password]
```

* __host__: fully qualified URL (such as http://localhost:9200)
* __settingsDir__: location of settings directory relative to where you are running the command (such as ../settings or ./settings)
* __--user__: (optional) Username for HTTP authorization
* __--pass__: (optional) Password for HTTP authorization


## Settings directory structure

```
index_one
    settings.json
	mappings
		type_one.json
		type_two.json
index_two
    settings.json
	mappings
		type_one.json
		type_two.json
aliases.json
```

_Note: Index settings files can also be written in YAML. For now, elasticsearch requires all other settings files must be JSON._

#### Things to note:

* `index_one` and `index_two` are directories whose names coorespond to the names of the indicies they are to create.
* `settings.json` define the settings of the index they are contained within. JSON/YAML in this file should follow [this structure](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/indices-create-index.html).
* `type_one.json` and `type_two.json` are files whose names coorespond to the names of the types they are to create within an index. JSON within the type desigations should follow [this structure](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/indices-put-mapping.html).
* `aliases.json` should follow [this structure](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/indices-aliases.html).
