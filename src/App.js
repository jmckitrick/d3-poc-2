import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, Label, Legend, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import './App.css';
import data from './data';

class App extends Component {
  constructor(props) {
    super(props);
    console.log('DATA', data);
    var hotelMin = data.Hotel.map(d => {
      return d.min;
    });
    console.log('HOTELMIN', hotelMin);

    this.state = {
      error: null,
      isLoaded: false,
      items: []
    }
  }

  buildUrl(product) {
    var now = new Date();
    var year = now.getFullYear();
    var url = "http://nodes.prod1.kube.tstllc.net:30900/api/v1/query_range?" +
        "query=tst_bookings{" +
        "status=%22Confirmed%22" +
        ",product=%22" + product + "%22" +
        "}&" +
        "start=" + year + "-02-12T00:00:00.000Z&" +
        "end=" + year + "-02-13T00:00:00.000Z&" +
        //"step=86400s"
        "step=3600s"
    ;

    return url;
  }

  // Extract `product` data from `raw` data.
  extractData(raw, product) {
    var data = raw.map((d, i, arr) => {
      if (i > 0) {
        var dt = new Date(d[0] * 1000);
        var h = dt.getHours();
        var v  = d[1];
        var vo = arr[i - 1] ? arr[i - 1][1] : v;
        var vd = v - vo;
        var row = {t: h};
        row[product] = vd;

        return row;
      }
      else {
        return null;
      }
    });

    return data;
  }

  reduceData(coll) {
    //console.log('COLL', coll);
    // coll.result[0].product
    // coll.result[0].values
    return coll.reduce((accum, el, idx) => {
      var data = el.data.result[0];
      var product = data.metric.product;
      var vals = data.values;
      //console.log('DATA', data);
      //console.log('Product', product);
      //console.log('Values', vals);
      var productData = this.extractData(vals, product);
      //console.log('Product data before', productData);
      var pd = productData.map((d, i) => {
        //console.log('product row index', i)
        //console.log('product row d', d)
        if (accum[i]) {
          //console.log('accum[i]', accum[i])
        }

        var row = accum[i] ? accum[i] : {};
        //console.log('row before', row);
        row.t = d ? d.t : null;
        row[product] = d ? d[product] : null;
        //var k = product + '.d';
        //row[k] = d ? d[product] : null;
        //console.log('row after', row);
        return row;
      });

      console.log('Product data after', pd);
      console.log('idx', idx);
      accum = pd;

      return accum;
    }, []);
  }

  componentDidMount() {
    var products = [
      'Air',
      'Car',
      'Hotel',
      'Cruise',
      'Activity',
      'Insurance',
      'Prepackaged',
      'Other'
    ];

    var reqs = products.map(product => {
      return fetch(this.buildUrl(product)).then(res => res.json())
    });

    Promise.all(reqs)
      .then(
        (result) => {
          console.log('Success!');
          console.log('DATA', result);
          // console.log('DATA', result[0].data.result[0].values);
          // var data = result.map((d, i) => {
          //   return [products[i], this.extractData(d.data.result[0].values)];
          // });
          // console.log('DATA', data);
          var agg = this.reduceData(result);
          console.log('TEST', agg);
          this.setState({
            isLoaded: true,
            //items: data[0]
            items: agg
          });
        },
        (error) => {
          console.log('Error!');
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    return (
      <div className="App"> {
        <div>
          <h1>Bookings</h1>
          <ResponsiveContainer width='100%' height={600}>
            <LineChart
              margin={{top: 10, right: 80, left: 80, bottom: 20}}
              data={this.state.items}>
              <XAxis dataKey="t">
                <Label value="Hour" position="bottom"/>
              </XAxis>
              <YAxis type="number" domain={[0, 'dataMax + 2']}>
                <Label value="Bookings" position="left"/>
              </YAxis>
              <CartesianGrid strokeDasharray="3 3" />
              {/* <Line dataKey="Air" legendType="circle" stroke="blue" /> */}
              {/* <Line dataKey="Car" legendType="circle" stroke="red" /> */}
              <Line dataKey="Hotel" legendType="circle" stroke="orange" />
              {/* <Line dataKey="Cruise" legendType="circle" stroke="green" /> */}
              {/* <Line dataKey="Activity" legendType="circle" stroke="purple" /> */}
              {/* <Line dataKey="Insurance" legendType="circle" stroke="cyan" /> */}
              {/* <Line dataKey="Prepackaged" legendType="circle" stroke="magenta" /> */}
              {/* <Line dataKey="Other" legendType="circle" stroke="violet" /> */}
              <Legend verticalAlign="top" height={20} wrapperStyle={{ top: 0, left: 60, right: 0, bottom: 0 }}/>
              <Tooltip/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      }
      </div>
    );
  }
}

export default App;
