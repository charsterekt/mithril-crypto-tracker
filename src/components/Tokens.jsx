import React, { useState, useEffect } from 'react'
import millify from 'millify'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Input } from 'antd'
import Loader from './Loader'
import { useGetCryptosQuery } from '../services/cryptoApi'

const Tokens = ({ simplified }) => {
    
    const count = simplified ? 12 : 100
    const {data: cryptosList, isFetching } = useGetCryptosQuery(count)
    const [cryptos, setCryptos]  = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    console.log(cryptos)

    useEffect(() => {
        // filter the data by term
        const filteredData = cryptosList?.data?.coins.filter((coin) => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setCryptos(filteredData)
    }, [cryptosList, searchTerm])

    if (isFetching) {
        return <Loader />
    }

    return (
        <>  
            {
                // Input field to filter out stuff
                // Also apparently react wants comments inside children to be within braces
                // Sure I guess
                // Also also don't render the searchbar on the homepage
                !simplified && (
                    <div className='search-crypto'>
                        <Input placeholder="Search for a token" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                )
            }

            <Row gutter={[32, 32]} className="crypto-card-container">
                {
                    // the ? here is to make sure that the data is not undefined before looping
                    cryptos?.map((currency) => (
                        <Col xs={24} sm={12} lg={6} className="crypto-card" key={currency.id}>
                            <Link to={`/crypto/${currency.id}`}>
                                <Card 
                                    title={`${currency.rank}. ${currency.name}`}
                                    extra={<img className="crypto-image" src={currency.iconUrl} alt={`${currency.name}`}/>}
                                    hoverable
                                >
                                    <p>Price: {millify(currency.price)}</p>
                                    <p>Market Cap: {millify(currency.marketCap)}</p>
                                    <p>Daily Change: {millify(currency.change)}%</p>
                                </Card>
                            </Link>
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

export default Tokens