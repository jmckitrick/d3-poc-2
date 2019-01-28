import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, Label, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import './App.css';

var data = [{name: '1:00', value: 40},
            {name: '2:00', value: 20},
            {name: '3:00', value: 10},
            {name: '4:00', value: 10},
            {name: '5:00', value: 15},
            {name: '6:00', value: 50},
           ];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    }
  }

  componentDidMount() {
    let url = "http://nodes.prod1.kube.tstllc.net:30900/api/v1/query_range?" +
    "query=tst_bookings{product=%22Air%22,status=%22Confirmed%22}&" +
    "start=2019-01-01T20:10:30.000Z&end=2019-01-25T20:10:30.000Z&step=86400s";

    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          console.log('Success!');
          console.log('DATA', result.data.result[0].values);
          let data = result.data.result[0].values.map((d, i, arr) => {
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
            data={this.state.items}
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
            data={this.state.items}
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
