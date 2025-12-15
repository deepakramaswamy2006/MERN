import React from 'react'

export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="card cart-item">
      <img
        src={item.image}
        alt={item.name}
        className="cart-thumb"
        onError={e => e.target.src = 'https://via.placeholder.com/80'}
      />
      <div style={{flex:1}}>
        <div style={{fontWeight:600}}>{item.name}</div>
        <div className="muted">₹{item.price} each</div>
        <div className="row" style={{marginTop:8}}>
          <button onClick={()=>onUpdate(item.id, item.qty - 1)} className="btn">-</button>
          <div style={{padding:'6px 10px', background:'#f0f0f0', borderRadius:6}}>{item.qty}</div>
          <button onClick={()=>onUpdate(item.id, item.qty + 1)} className="btn">+</button>
          <button onClick={()=>onRemove(item.id)} style={{marginLeft:12, background:'#e55353'}} className="btn">Remove</button>
        </div>
      </div>
      <div style={{minWidth:80, textAlign:'right', fontWeight:700}}>₹{item.price * item.qty}</div>
    </div>
  )
}