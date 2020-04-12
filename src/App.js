import React, { useState, useEffect } from 'react';
import './App.css';

import * as request from 'request-promise';
import styled from 'styled-components';
import moment from 'moment';

const SERVER_PATH = 'https://wxxzhw35u4.execute-api.us-east-1.amazonaws.com/dev/donations';
// const SERVER_PATH = 'http://localhost:3000/dev/donations';

const getDonations = async (page=1) => {
  const options = {
    uri: `${SERVER_PATH}?page=${page}`,
    headers: {
      // Authorization: `Bearer ${bearerToken}`
    },
    json: true
  };
  const response = await request(options);
  return response;
};

const App = () => {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,400,300,600,700,800" media="all"/>
      <Donations />
    </div>
  );
};

const Donations = () => {
  useEffect(() => {
    const fetchData = async () => {
      const responseDonations = await getDonations();
      console.log(responseDonations);
      setDonations(responseDonations);
    };
    fetchData();
  }, []);

  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(1);
  const handleShowMore = async (event) => {
    // console.log('show more');
    const newPage = page + 1;
    const newDonations = await getDonations(newPage);
    // console.log('new', newDonations);
    setDonations([...donations, ...newDonations]);
    // setDonations(donations.push(...newDonations));
    setPage(page + 1);
  };

  return (
    <StyledList>
      <div className='donations'>
        {donations.map(donation => {
          return (
            <div className='donation' key={ donation.id }>
              <Avatar donation={donation} />
              <div className='donationContent'>
                {donation.name ? <NamedMessage donation={donation} /> : <AnonymousMessage donation={donation} />}
                {donation.comment ? <Comment comment={donation.comment} /> : null}
                <DonationInfo donation={donation} />
              </div>
            </div>
          );
        })}
        <ShowMoreButton handleShowMore={handleShowMore} />
      </div>
    </StyledList>
  );
};

const ShowMoreButton = ({handleShowMore}) => (
  <button className='showMoreButton' onClick={handleShowMore}>
    Show More
  </button>
);

const Avatar = ({ donation }) => {
  let initial = donation.name ? donation.name[0] : null;
  const classes = ['avatar'];
  if (!donation.name) { classes.push('anonymous'); }

  return (
    <div className={classes.join(' ')}>
      {donation.name ? <div className='initial'>{initial}</div> : <img className='anonymous' src="/anonymous.png" alt='anonymous'/>}
    </div>
  );
}

const NamedMessage = ({ donation }) => (
  <div className='message'>
    <span className='name'>{donation.name}</span> donated {donation.amount}
  </div>
);

const Comment = ({ comment }) => (
  <p className='comment'>
    {comment}
  </p>
);

const AnonymousMessage = ({ donation }) => (
  <div className='message' key={ donation.id }>
    {donation.amount} was donated anonymously
  </div>
);

const DonationInfo = ({ donation }) => {
  const date = new Date(donation.createdAt);
  const timeAgo = moment(date).fromNow();
  return (
    <div className='info'>{donation.createdAt},{date},{timeAgo}</div>    
  );
};

const StyledList = styled.div`
  .donations {
    text-align: left;
    margin: 35px 20px;
    font-size: 12px;
    font-family: Open Sans,Arial,Helvetica,sans-serif;
    /* -webkit-font-smoothing: antialiased; */
  }
  .donations .showMoreButton {
    display: block;
    background-color: rgba(0,0,0,.03);
    color: #727e83;
    border-style: none;
    outline: 0;
    font-size: 12px;
    font-weight: 600;
    padding: 30px 0;
    width: 100%;
    cursor: pointer;
    transition: background .2s ease;
  }
  .donations .showMoreButton:hover {
    background-color: rgba(0,0,0,0.06);
  }

  .donation {
    /* display: flex; */
    margin: 0 0 25px;
    color: rgba(0,0,0,.87);
    line-height: 24px;
  }

  .donation:nth-child(even) .avatar {
    background-color: rgba(160,160,160);
  }

  .donation .avatar {
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(114, 114, 114);
    width: 38px;
    height: 38px;
    border-radius: 38px;
    margin-right: 15px;
  }
  .donation .avatar.anonymous {
    background-color: inherit;
  }
  .donation .avatar img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
  .donation .avatar .initial {
    color: #fff;
    display: block;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    width: 100%;
    text-align: center;
  }
  .donation .donationContent {
    display: flex;
    flex-direction: column;
  }
  .donation .message .name {
    font-size: 14px;
    font-weight: 600;
  }
  .donation .comment {
    margin: 0;
    padding: 0;
    font-size: 12px;
    color: rgba(0,0,0,.54);
  }
  .donation .info {
    font-size: 11px;
    color: rgba(0,0,0,.54);
    /* margin-top: 3px; */
  }
`;

// const Donation = (donation) => {
//
// };

export default App;
