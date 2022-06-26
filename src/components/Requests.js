import { utils } from 'ethers';
import { useQuery } from 'urql';
import * as config from '../config';
import styled from 'styled-components'

const CardContainer = styled.div`
  background: #E6E6E6;
  display: block;
  width: 50%;
  padding: 24px;
  margin: 32px auto 32px auto;
  border-radius: 16px;
`

const queryRecentRequests = `
{
  requests(where: {delivered: false, refunded: false}, orderBy: createdTimestamp, orderDirection: desc) {
    createdTimestamp
    deadline
    amount
    erc20
    description
    requester
    creator {
      userName
      twitterHandle
      address
    }
  }
}
`

function Requests() {
  const [{ data, fetching, error }] = useQuery({
    query: queryRecentRequests,
  });


  return (
  <CardContainer>
    {(fetching || (data && data.requests.length === 0)) && (
        <div>Loading...</div>
      )}
      {error && <div>error</div>}
    {data && data.requests
      .filter((request, i) => (
        Date.now() <= new Date(request.createdTimestamp*1000+ request.deadline*24*60*60*1000)
      ))
      .map((request, i) => { 
        return (
          <div key={i}>
            <p>===================================</p>
            <p>{request.creator.userName}: <a href={`https://twitter.com/${request.creator.twitterHandle}`}>Twitter</a></p>
            <p>{utils.formatUnits(request.amount, config.tokens[request.erc20].decimals)}{' '}{config.tokens[request.erc20].symbol } </p>
            <p>Deadline: {new Date(request.createdTimestamp*1000+ request.deadline*24*60*60*1000).toLocaleString()}</p>
            <p>{request.description}</p>
            <p>creator: {request.creator.address}</p>
            <p>requester: {request.requester}</p>
            <p>created at: {new Date(request.createdTimestamp*1000).toLocaleString()}</p>
          </div>
        )
      }
    )}
  </ CardContainer>
  )

}

export default Requests;
