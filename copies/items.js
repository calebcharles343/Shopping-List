/*
To implement a shopping list feature where users can add and delete items with a calculated total, you’ll need:

1. **A `shop_items` table** in your database to store item details.
2. **A `shopping_list` table** to link users with the items they add.
3. **Server-side logic** to handle CRUD (Create, Read, Update, Delete) operations for the shopping list and calculate the total.
4. **Optional client-side logic** for a real-time, interactive user experience.

Here's how to structure it:

### Step 1: Create `shop_items` and `shopping_list` Tables

Define the `shop_items` table for storing item details and the `shopping_list` table to track items each user has added to their shopping list.

```javascript
*/
const createShopItemsTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS shop_items (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    price NUMERIC(10, 2) NOT NULL
  )`;

  try {
    await pool.query(queryText);
    console.log("Shop items table created successfully or already exists");
  } catch (error) {
    console.error("Error creating shop items table:", error);
  }
};

const createShoppingListTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS shopping_list (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES shop_items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
  )`;

  try {
    await pool.query(queryText);
    console.log("Shopping list table created successfully or already exists");
  } catch (error) {
    console.error("Error creating shopping list table:", error);
  }
};
/*
```

### Step 2: Implement Server-Side CRUD Operations

You can create server-side functions or API endpoints to handle adding, deleting, and calculating the total cost of items in the shopping list.

#### Add Item to Shopping List

```javascript
*/
export const addItemToShoppingList = catchAsync(async (req, res, next) => {
  const { userId, itemId, quantity } = req.body;

  const queryText = `INSERT INTO shopping_list (user_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
  const values = [userId, itemId, quantity];

  const result = await pool.query(queryText, values);
  res.status(201).json({
    status: "success",
    data: result.rows[0],
  });
});

/*
```

#### Delete Item from Shopping List

```javascript
*/
export const deleteItemFromShoppingList = catchAsync(async (req, res, next) => {
  const { userId, itemId } = req.body;

  await pool.query(
    "DELETE FROM shopping_list WHERE user_id = $1 AND item_id = $2",
    [userId, itemId]
  );

  res.status(204).json({
    status: "success",
    data: null,
  });
});

/*
```

#### Calculate Total Cost of Shopping List

```javascript
*/
export const calculateTotal = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const queryText = `
    SELECT SUM(si.price * sl.quantity) AS total
    FROM shopping_list sl
    JOIN shop_items si ON sl.item_id = si.id
    WHERE sl.user_id = $1
  `;
  const result = await pool.query(queryText, [userId]);
  const total = result.rows[0].total || 0;

  res.status(200).json({
    status: "success",
    data: { total },
  });
});

/*
```

### Step 3: Decide Between Server-Side and Client-Side

**Best Practice**:
- **Server-Side**: Calculations, such as total cost, should ideally be done server-side to maintain data integrity and prevent tampering.
- **Client-Side**: Use client-side logic to make the interface interactive, allowing users to add, remove, or update items in real time. However, always synchronize with the server for final calculations and storage.

This setup ensures a secure, reliable shopping list system with a responsive user interface.
*/
