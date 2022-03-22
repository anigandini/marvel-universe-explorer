# Marvel Universe Explorer

A Next js App where you're gonna be able to search and know more about your favorite marvel's heroes.

Live demo: https://marvel-universe-explorer.vercel.app/

## Description
This application fetches data from the Marvel API inside the getStaticProps (on server side) and the next api routes (on client side). This guarantees that the API keys would never be exposed on the browser. Before returning the data, it is serialized by the serialize functions inside the helpers folder to match the data model inside interfaces directory. This way you only have to change the serializer in case the API changes or simply scale the app.

## Used technologies
-Next js: for SSR, speed optimization and keys security.
-Typescipt
-CSS modules: I choose it before css-in-js for performance optimization.
-Marvel API
-Swiper


## To Do
-Improve styles of section cards
-Allow load more search results
-Tests
-Add animations


## License
[MIT](https://choosealicense.com/licenses/mit/)