import { useState, useEffect,useRef } from 'react'
import './BugHunt.css'

//Suggestion for improvement : use typeScript

function BugHunt() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', price: 10, quantity: 1 },
    { id: 2, name: 'Item 2', price: 20, quantity: 2 },
    { id: 3, name: 'Item 3', price: 15, quantity: 1 }
  ])
  const [discount, setDiscount] = useState(0)
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Bug fix  //
  const counter = useRef(0);
  const [, forceRender] = useState(0); //ui update
  useEffect(() => { //help from chatGBT
    /*
      Because useEffect was dependent on the counter value 
      every time the page was rendered 
      so the following code replaced the previous code
    */
    const interval = setInterval(() => {
      counter.current += 1;
      forceRender((n) => n + 1);
    }, 100);
    return () => clearInterval(interval); // clear timer
  }, []);
// end //
  const calculateTotal = () => {
    /*
    Bug fix:
      Instead of =, * should have been used
    Improvement:
      It is better to use forEach and get better performance and the code is more readable
    */
    let total = 0
    items.forEach(item=>{ 
      total += item.price*item.quantity
    })
    return total
  }

  const applyDiscount = (total) => {
    //Bug fix: The discount percentage calculation was wrong and a new formula was written
    return total - (total * discount)/100
  }

  const handleLogin = () => {
    if (username.length < 3) {
      alert('Username must be at least 3 characters')
      return
    }
    setIsLoggedIn(true) //Bug fix
  }

  const handleLogout = () => {
    setIsLoggedIn(false) //Bug fix
    setUsername('')
  }

  const updateQuantity = (id, newQuantity) => {
    /*
      Bug fix:
        When the value was set to zero, the item name was deleted and did not return. 
      Improvement:
        New code is more readable and increases speed without the need for indentation.
    */
    let newItem=[...items]
    let index=newItem.findIndex(e=>e.id==id)
    if(index>-1){
      newItem[index].quantity=newQuantity
    }
    setItems(newItem)
  }

  const removeItem = (id) => {
    /*
    Bug fix:
      When an item was deleted, the item that was deleted would remain and the rest of the items would be deleted (the opposite of the delete function)
    Improvement:
      It is better to use the unequal condition with the filter function and filter the sets that should not be deleted
    */
    let newItem=items.filter(item => item.id !== id)
    setItems(newItem)
  }

  const total = calculateTotal()
  const finalTotal = applyDiscount(total)

  return (
    <div className="page-container">
      <h2 className="page-title">Challenge 2: Bug Hunt</h2>
      
      <div className="instructions">
        <h3>Your Task:</h3>
        <ul>
          <li>This page contains <strong>6 logical bugs</strong> that need to be fixed</li>
          <li>The bugs are in the component logic, not in styling</li>
          <li>Test all features to identify what&apos;s not working correctly:</li>
          <ul>
            <li>Counter behavior</li>
            <li>Shopping cart total calculation</li>
            <li>Discount application</li>
            <li>Login/Logout functionality</li>
            <li>Item quantity updates</li>
            <li>Item removal</li>
          </ul>
          <li>Document each bug you find and how you fixed it</li>
        </ul>
      </div>

      <div className="bug-hunt-content">
        {/* Counter Section */}
        <div className="section">
          <h3>Counter Feature</h3>
          <p>Counter: {counter.current}</p>
          <p className="hint">⚠️ Check the browser console and watch the counter behavior</p>
        </div>

        {/* Login Section */}
        <div className="section">
          <h3>User Login</h3>
          {isLoggedIn ? (
            <div>
              <p>✅ Welcome, {username}!</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <p>❌ Please log in</p>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
              <button onClick={handleLogin}>Login</button>
            </div>
          )}
          <p className="hint">Try logging in with a username (3+ chars)</p>
        </div>

        {/* Shopping Cart Section */}
        <div className="section">
          <h3>Shopping Cart</h3>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length==0&& //ux improvement:Notify the user if the item is missing. Item does not exist.
                <p>Item does not exist.</p>
              }
              {items.map((item,key) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                      min="0"
                      style={{ width: '60px' }}
                      id={'input'+item.id} //Improvement:It is better to give ids to inputs
                    />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <div className="discount-input">
              <label>Discount (%):</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                style={{ width: '80px' }}
              />
            </div>
            
            <div className="total-row final">
              <span>Final Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <p className="hint">
            Try: updating quantities, removing items, and applying a discount
          </p>
        </div>
      </div>

      <div className="bug-documentation">
        <h3>📝 Bug Report Template</h3>
        <p>Document your findings:</p>
        <ol>
          <li><strong>Bug Location:</strong> Where is the bug?</li>
          <li><strong>Expected Behavior:</strong> What should happen?</li>
          <li><strong>Actual Behavior:</strong> What actually happens?</li>
          <li><strong>Fix Applied:</strong> How did you fix it?</li>
        </ol>
      </div>
    </div>
  )
}

export default BugHunt

