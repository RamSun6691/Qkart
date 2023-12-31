import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import Cart, {generateCartItemsFrom} from "./Cart"

const Products = () => {
  const [items, setItems] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const token = localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);

      setIsLoading(false);
      setProducts(response.data);
      setFilteredProducts(response.data);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      if (err.response?.status === 500) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products.Check that the backend is running,reachable and retuns valid Json",
          { variant: "error" }
        );
      }
    }
  };
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setFilteredProducts(response.data);
      return response.data;
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setFilteredProducts([]);
        }

        if (err.response.status === 500) {
          enqueueSnackbar(err.response.data.message, { variant: "error" });
          setFilteredProducts(products);
        }
      } else {
        enqueueSnackbar(
          "Could not fetch products.Check that the backend is running,reachable and retuns valid Json",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };
  useEffect(() => {
    performAPICall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(products){
    fetchCart(token)
      .then((cartData) => generateCartItemsFrom(cartData, products))
      .then((cartItems) => setItems(cartItems));
    }
    },[products]);

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
     const url= `${config.endpoint}/cart`
      const response = await axios.get(url,{
        headers: {
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        }
      });

      // setIsLoading(false);
      // setProducts(response.data);
      // setFilteredProducts(response.data);
      return response.data;
      
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return !!items.find((item)=>item.productId === productId);
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
   const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log("check")

    if(!token){
      enqueueSnackbar("Login to add an item to the Cart", {autoHideDuration:3000,variant:'warning'})
      return;
    }
    console.log("first")
    if(options.preventDuplicate && isItemInCart(items,productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",
      {autoHideDuration:3000,variant:'warning'})
      return;
    }
    try {
      const url = `${config.endpoint}/cart`
      const response = await axios.post(url,
        {
          productId: productId,
          qty: qty,
          
        },
        {
          headers: {
            'Content-Type':'application/json',
            Authorization:`Bearer ${token}`
          }
        }
        )
        if(response.status === 200){
          const items= generateCartItemsFrom(response.data,products)
          setItems(items)
        }
    }catch(error){
      console.log(error)
      enqueueSnackbar("/item already in cart/i",{
        variant:'error'
      });
      return null
    }
  };


    // const updateCartItems = (cartData,products)=>{
    //   const cartItems =generateCartItemsFrom(cartData, products);
    //   setItems(cartItems)
    // }

  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await performAPICall();
      const cartData= await fetchCart(token)
      const cartDetails = await generateCartItemsFrom(cartData,productsData );
      setItems(cartDetails);
    };
    onLoadHandler();
  }, []);

  // lear

 

  
  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items.categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Header>
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />
      {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
      <Grid container>
        <Grid
          item
          xs={12} 
          md={token && products.length ? 9 : 12}
          // className="product-grid"
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {isLoading ? (
            <Box className="loading">
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>
          ) : (
            <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={async () => {
                        await addToCart(
                          token,
                          items,
                          products,
                          product._id,
                          1,
                          {
                            preventDuplicate: true,
                          }
                        );
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "#636363" }}>No Products Found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {token ? (
          <Grid  item xs={12} md={3} bgcolor="#E9F5E1">
            <Cart
              hasCheckoutButton
              products={products}
              items={items}
              handleQuantity={addToCart}
              isReadOnly ={false}
            />
          </Grid>
        ): null}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
