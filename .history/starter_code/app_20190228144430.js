const express       = require('express');
const hbs           = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser')



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const clientId = '4e00e7b6dc75438d85abd08fdeb95344',
        scopes = ['user-read-private', 'user-read-email'],
  clientSecret =  '983c8a38e9534cdeb562c48d3f3f26f6',
   redirectUri = 'localhost:3000/callback';

 
// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});
 
// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
 
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

//get
app.get("/artists", (req, res) => {

  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    res.render("artists", {artists: data.body.artists.items})
    console.log(data.body.artists.items);
  })
  .catch(err => {
   console.log("an error occured!" + err)
  })

})

//get albums
app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
      res.locals.albumArray = data.body.items
      res.render('album');
  })
  .catch(err => next(err));
});

//get album track
app.get('/tracks/:trackId', (req, res, next) => {
  const { trackId } = req.params;

  spotifyApi.getAlbumTracks(trackId)
  .then(data => {
      // res.send(data);
      res.locals.tracksArray = data.body.items
      res.render("tracks");
  }) 
  .catch(err => next(err));
});

// the routes go here:
const index = require('./routes/index');
app.use('/', index);

app.get('/', (req, res, next) => {
  res.render('callback');
});

 

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
