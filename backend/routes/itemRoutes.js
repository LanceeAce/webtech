app.get('/items', async (req, res) => {
    const db = await connectDB();  // Connect to the database
    const items = await db.collection('items').find().toArray();  // Get all items
    res.json(items);  // Return items as a JSON response
});

app.post('/add-item', async (req, res) => {
    const { name, price, category, description } = req.body;
    const db = await connectDB();  // Connect to the database
    await db.collection('items').insertOne({ name, price, category, description });  // Insert new item
    res.status(200).json({ success: true, message: 'Item added.' });
});

app.delete('/delete-item/:id', async (req, res) => {
    const { id } = req.params;  // Get item ID from URL
    const db = await connectDB();  // Connect to the database
    await db.collection('items').deleteOne({ _id: new ObjectId(id) });  // Delete item
    res.status(200).json({ success: true, message: 'Item deleted.' });
}); 