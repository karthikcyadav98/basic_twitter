import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UserItems from './UserItem'

class UserData extends Component {

    constructor(props) {
        super(props)

        this.state = {
            profiles: this.props.profiles
        }

        this.searchTable = this.searchTable.bind(this)
    }

    searchTable = (e) => {
        const string = e.target.value
        const searchPrbatch = this.props.profiles.filter(item => Object.keys(item.name).some(k => item.name.toLowerCase().includes(string.toLowerCase())));
        console.log("change", searchPrbatch)

        this.setState({
            profiles: searchPrbatch
        })
    }

    render() {
        const profiles = this.state.profiles

        return (
            <div>
                <div className="md-form mt-0">
                    <input className="form-control" type="text" placeholder="Search" onChange={this.searchTable} />
                </div>
                <br />
                {profiles.map(item => (<UserItems key={item._id} profile={item} />))}
            </div>
        )
    }
}

UserData.propTypes = {
    profiles: PropTypes.object.isRequired
}

export default UserData