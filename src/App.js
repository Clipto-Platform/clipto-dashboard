import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { createClient } from 'urql';
import {utils} from 'ethers'
const graphInstance = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/clipto-platform/clipto-subgraph-mainnet',
});

const queryRecentRequests = `
{
  requests(where: {delivered: false, refunded: false}, orderBy: createdTimestamp, orderDirection: desc) {
    createdTimestamp
    deadline
    amount
    erc20
    creator {
      userName
      twitterHandle
    }
  }
}
`

const getRequests = () => {
  return graphInstance.query(queryRecentRequests, {}).toPromise()
}

function App() {
  const [requests, setRequests] = useState([]);
  useEffect(() => {getRequests().then(res => setRequests(res.data.requests))},[])
  useEffect(() => {getRequests().then(res => console.log(res.data.requests))},[])



  return (
  <div className="App">
    {requests.length === 0 && (
        <div>Loading...</div>
      )}
    {requests.map((request, i) => {
      if (Date.now() > new Date(request.createdTimestamp*1000+ request.deadline*24*60*60*1000)) return;
      return <div key={i}>
        <p>===================================</p>
        <p>{request.creator.userName}: <a href={`https://twitter.com/${request.creator.twitterHandle}`}>Twitter</a></p>
        <p>{utils.formatUnits(request.amount, 18)}{' '}{request.erc20 == 0 ? 'MATIC' : 'Different currency detected' + request.erc20 } </p>
        <p>Deadline: {new Date(request.createdTimestamp*1000+ request.deadline*24*60*60*1000).toLocaleString()}</p>
        <p>{}</p>
      </div>
    })}
  </div>
  )

}

export default App;
