const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

let cards = [];
let jokeParameters = {};
let errorOccurred = false;

const jokeApi = axios.create({
    baseURL: 'https://v2.jokeapi.dev',
    timeout: 5000
});


app.get('/', async (req, res) => {
    res.render('index', { ...jokeParameters, cards, errorOccurred: errorOccurred });
    errorOccurred = false;
});


app.post('/', async (req, res) => {
    console.log(req.body);

    let categories = req.body.categories ?? [];
    if (!Array.isArray(categories))
        categories = [categories];
    let flags = req.body.flags ?? [];
    if (!Array.isArray(flags))
        flags = [flags];

    const joke = await fetchJoke(categories, flags, Boolean(req.body['safemode-checkbox']));
    errorOccurred = joke.error;
    if (!errorOccurred)
        prependJoke(joke);

    res.redirect('/');
});


app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    jokeParameters = await fetchParameters();
});


function prependJoke(joke) {
    const jokeFlags = Object.keys(joke.flags).filter(key => joke.flags[key]);
    const jokeContent = joke.joke ?? [joke.setup, joke.delivery].join('\n');
    cards.unshift({
        id: joke.id,
        category: joke.category,
        flags: jokeFlags,
        content: jokeContent.trim(),
    });
    console.log(cards[0]);
};


async function fetchJoke(categories, flags, safemode) {
    try {
        const response = await jokeApi.get('/joke/' + categories.join(), {
            params: {
                'blacklistFlags': flags || undefined,
                'safe-mode': safemode,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error.response);
        return { 'error': error.response?.status };
    }
};


async function fetchParameters() {
    async function fetchCategories() {
        try {
            const response = await jokeApi.get('/categories');
            console.log('Got categories');
            return response.data.categories;
        } catch (error) {
            console.error('Error fetching joke categories:', error.message);
        }
    };

    async function fetchFlags() {
        try {
            const response = await jokeApi.get('/flags');
            console.log('Got flags');
            return response.data.flags;
        } catch (error) {
            console.error('Error fetching joke flags:', error.message);
        }
    };

    const [categories, flags] = await Promise.all([
        fetchCategories(),
        fetchFlags(),
    ]);

    return { categories, flags };
};