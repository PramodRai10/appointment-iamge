import React from 'react'
import Layout from '../components/Layout'

export default function NotFound(){
    return(
        <Layout className="errorPage">
            <div className="errorContent">
                <h1>404</h1>
                <p>Page Not Found</p>
            </div>
                
        </Layout>    
    )
}