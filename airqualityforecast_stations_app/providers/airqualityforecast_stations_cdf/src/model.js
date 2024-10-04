const request = require('request').defaults({ gzip: true, json: true })
const config = require('config')

function Model (koop) {}

// A Model is a javascript function that encapsulates custom data access code.
// Each model should have a getData() function to fetch the geo data
// and format it into a geojson
Model.prototype.getData = function (req, callback) {
 
  request({
    uri: config.apiUrl,
    method: 'GET'
  }, (err, res, body) => {
    if (err) return callback(err)
    const geojson = translate(body)
    callback(null, geojson)
  })
}

function translate(data) {
  
  let features = data.map(row => {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [Number(row.longitude), Number(row.latitude)]
      },
      "properties": {
        "Navn": row.name,
        "ID": row.eoi,
        "Hoeyde": row.height,
        "Grunnkrets": row.grunnkrets.name,
        "Delomraade": row.delomrade.name,
        "Kommune": row.kommune.name
      }
    }
  })

  let geojson = {
    type: 'FeatureCollection',
    features: features
  }

  geojson.metadata = {
    name: 'Met Airquality Stations',
    description: 'Air quality stations from Met API',
    geometryType: 'Point'
  }

  return geojson
}

module.exports = Model
