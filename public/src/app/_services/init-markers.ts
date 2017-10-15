export class Init {
    load() {
        if (localStorage.getItem('markers') === null || localStorage.getItem('markers') === undefined) {
            console.log('No markers found....creating.....');
            var markers: [
                {
                  name: 'Nurse1',
                  lat: 10.793581,
                  lng:  106.678031,
                  draggable: true
                },
                {
                  name: 'Nurse2',
                  lat: 10.845614,
                  lng: 106.777996,
                  draggable: true
                },
                {
                  name: 'Nurse3',
                  lat: 10.783160,
                  lng: 106.664787,
                  draggable: true
                }
            ];

            localStorage.setItem('markers', JSON.stringify(markers));
        }
        else{
            console.log(".....Loading......")
        }
    }
}