import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchOneProduct} from '../store/singleproduct.js'
import {
  postOrder,
  fetchProdOrder,
  updatePendingOrder
} from '../redux/user_orders.js'

class OneProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }
  /*eslint-disable */
  handleSubmit(product_id, userId, price) {
    let amount = Number(this.state.value)
    let total_price = price * amount

    return async event => {
      event.preventDefault()
      if (userId) {
        await this.props.checkProdExists(userId, product_id)
        if (this.props.foundProd) {
          let orig_amount = this.props.foundProd.products[0].order_product
            .amount
          this.props.updateOrder(
            {amount: amount + orig_amount},
            userId,
            product_id
          )
        } else {
          this.props.addShoppingCart(
            {amount, price, total_price, product_id},
            userId
          )
        }
      }

      let x = document.getElementById('snackbar')
      x.className = 'show'
      setTimeout(function() {
        x.className = x.className.replace('show', '')
      }, 3000)
    }
  }

  componentDidMount() {
    this.props.getOneProduct(this.props.match.params.productId)
    // console.log('comp mount:', this.props)
  }

  render() {
    function displayPrice(num) {
      let exponent = Math.pow(10, -2)
      let answer = num * exponent
      return answer.toFixed(2)
    }

    function formatInput(e) {
      //this prevents unwanted input in add to cart field
      let checkIfNum
      if (e.key !== undefined) {
        checkIfNum =
          e.key === 'e' || e.key === '.' || e.key === '+' || e.key === '-'
      }
      return checkIfNum && e.preventDefault()
    }

    return (
      <div className="one-product">
        <img id="img" src={this.props.singleproduct.img} />
        <div className="one-product-info">
          <div className="one-product-text text-bold">
            {this.props.singleproduct.name}
          </div>
          <div className="one-product-text">
            ${displayPrice(this.props.singleproduct.price)}
          </div>
          <div className="one-product-text text-small">
            {this.props.singleproduct.description}
          </div>
          <form
            onSubmit={this.handleSubmit(
              this.props.singleproduct.id,
              this.props.match.params.user_id,
              this.props.singleproduct.price
            )}
          >
            <label>
              <input
                type="number"
                min="1"
                onKeyDown={evt => {
                  formatInput(evt)
                }}
                value={this.state.value}
                onChange={this.handleChange}
              />
            </label>
            <input type="submit" value="Add To Cart" />
          </form>
        </div>
        <div id="snackbar">
          Added {this.state.value} of these treats to cart!
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    singleproduct: state.singleproduct,
    foundProd: state.pendingOrders
  }
}

const mapDispatch = dispatch => {
  return {
    getOneProduct: id => dispatch(fetchOneProduct(id)),
    addShoppingCart: (newOrder, userId) =>
      dispatch(postOrder(newOrder, userId)),
    checkProdExists: (userId, productId) =>
      dispatch(fetchProdOrder(userId, productId)),
    updateOrder: (pendingOrder, userId, productId) =>
      dispatch(updatePendingOrder(pendingOrder, userId, productId))
  }
}

export default connect(mapState, mapDispatch)(OneProduct)

// export default OneProduct;
