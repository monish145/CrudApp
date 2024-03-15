import React, { useEffect, useState} from "react";
import axios from "axios";
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    city: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/users');
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
        setUsers([]);
        setFilteredUsers([]);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);

    const filtered = users.filter(user => {
      const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;
      return fullName.includes(searchText) || user.address.city.toLowerCase().includes(searchText);
    });

    setFilteredUsers(filtered);
  };

  const handleDelete = (index) => {
    const updatedUsers = [...filteredUsers];
    updatedUsers.splice(index, 1);
    setFilteredUsers(updatedUsers);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = () => {
    setEditIndex(-1);
  };

  const handleInputChange = (e, fieldName) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1, // Assign a new ID to the user
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: formData.age,
      address: {
        city: formData.city
      }
    };
    setUsers([...users, newUser]);
    setFilteredUsers([...users, newUser]); // Update the filtered users as well
    setFormData({ // Reset the form data
      firstName: '',
      lastName: '',
      age: '',
      city: ''
    });
  };

  return (
    <div className="container">
      <h3>CRUD Application</h3>
      <div className="input-search">
        <input
          type="search"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search by name or city"
        />
        <button className="btn green">Add Record</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {editIndex === index ? (
                  <input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange(e, 'firstName')}
                  />
                ) : (
                  user.firstName
                )}{' '}
                {editIndex === index ? (
                  <input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange(e, 'lastName')}
                  />
                ) : (
                  user.lastName
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    value={formData.age}
                    onChange={(e) => handleInputChange(e, 'age')}
                  />
                ) : (
                  user.age
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    value={formData.city}
                    onChange={(e) => handleInputChange(e, 'city')}
                  />
                ) : (
                  user.address.city
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <button className="btn green" onClick={handleSave}>
                    Save
                  </button>
                ) : (
                  <button className="btn green" onClick={() => handleEdit(index)}>
                    Edit
                  </button>
                )}
              </td>
              <td>
                <button className="btn red" onClick={() => handleDelete(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Form to add new record */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange(e, 'firstName')}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange(e, 'lastName')}
        />
        <input
          type="text"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => handleInputChange(e, 'age')}
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => handleInputChange(e, 'city')}
        />
        <button type="submit" className="btn green">Add Record</button>
      </form>
    </div>
    );
  }

export default App;