import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, Label, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    }
  }

  buildUrl(product) {
    let url = "http://nodes.prod1.kube.tstllc.net:30900/api/v1/query_range?" +
        "query=tst_bookings{product=%22" + product + "%22,status=%22Confirmed%22}&" +
        "start=2019-01-01T20:10:30.000Z&end=2019-01-25T20:10:30.000Z&step=86400s";

    return url;
  }

  extractData(raw) {
    let data = raw.map((d, i, arr) => {
      let dt = new Date(d[0] * 1000);
      //let t  = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
      let t  = (dt.getMonth() + 1) + '/' + dt.getDate();
      let v  = d[1];
      let vo = arr[i - 1] ? arr[i - 1][1] : v;
      let vd = v - vo;
      console.log('Date: ', dt);
      console.log('t: ', t);
      console.log('v: ', v);
      console.log('vo: ', vo);
      console.log('vd: ', vd);
      return {
        //name: d[0],
        name: t,
        value: vd};
    })
    return data;
  }

  componentDidMount() {

    var req1 = fetch(this.buildUrl('Air')).then(res => res.json())
    var req2 = fetch(this.buildUrl('Car')).then(res => res.json())

    Promise.all([req1, req2])
      .then(
        (result) => {
          console.log('Success!');
          console.log('DATA', result);
          console.log('DATA', result[0].data.result[0].values);
          var data = [];
          data[0] = this.extractData(result[0].data.result[0].values)
          data[1] = this.extractData(result[1].data.result[0].values)
          //console.log('DATA', data);
          this.setState({
            isLoaded: true,
            //items: result.result[0]
            items: data
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
      <div className="App">
        <ResponsiveContainer width='50%' height={300}>
          <LineChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            margin={{top: 20, right: 10, left: 10, bottom: 50}}
            data={this.state.items[0]}
            >
            <XAxis dataKey="name">
              <Label value="Date" position="bottom"/>
            </XAxis>
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Line dataKey="value" />
            <Legend verticalAlign="top" height={20} />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width='50%' height={300}>
          <LineChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            margin={{top: 20, right: 10, left: 10, bottom: 50}}
            data={this.state.items[1]}
            >
            <XAxis dataKey="name">
              <Label value="Date" position="bottom"/>
            </XAxis>
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Line dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default App;
