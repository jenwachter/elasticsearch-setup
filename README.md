# Elasticsearch setup

Reads settings from files and sets up an elasticsearch node. Currently supports aliases, index settings, and type mapping.

## Usage

```bash
$ essetup [host] [settingsDir]
```

* __host__: fully qualified URL (such as http://localhost:9200)
* __settingsDir__: location of settings directory relative to where you are running the command (such as ../settings or ./settings)


## Settings directory structure

```
index_one
	mappings
		type_one.json
		type_two.json
index_two
	mappings
		type_one.json
		type_two.json
aliases.json
```

#### Things to note:

* `index_one` and `index_two` are directories whose names coorespond to the names of the indicies they are to create.
* `type_one` and `type_two` are files whose names coorespond to the names of the types they are to create within an index. JSON within the type desigations should follow [this structure](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/indices-put-mapping.html).
* `aliases.json` should follow [this structure](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/indices-aliases.html).
