yolo-tips
===

Cheap Flight Suggester, that suggests you weekend trips based on the cheapest deals it finds using SkyScanner.


# cli

## usage

```
npm install yolo-tips -g

yolo-tips --origin LIS --weeks 2 --max 50
```

## available options

```
-c, --currency       currency
-w, --weeks          weeks
-o, --origin         origin
-d, --destination    destination
-m, --max            max price
```


# module

```javascript
const yolo = require('yolo-tips')

const options = {
  origin: 'LIS',
  weeks: 2,
  max: 500,
  destination: 'EVERYWHERE'
}

yolo(options, (err, results) => {
  if (err) {
    return console.error(err)
  }

  console.log(JSON.stringify(data, null, 2))
})
```
