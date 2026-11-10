/* =====================================================================
   horizon.dev — talk tracks and "how do I know?" explanations
   One entry per step, in order. Each one adds to the step in projects.js:
     ask    -> "We're being asked to..." (shown at the top of the Instructor View)
     know   -> one short "How do I know?" line, also shown on the learner's quest card
     clues  -> how the words in the question point to the command (Instructor View)
     terms  -> [word, plain meaning] pairs (Instructor View)
     talk   -> the talk track: "We're being asked to ___. So here's what we do, and why."
   ===================================================================== */
(function () {
  function dedent(text) {
    const lines = text.split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    const ind = lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length);
    const min = ind.length ? Math.min(...ind) : 0;
    return lines.map(l => l.slice(min)).join("\n");
  }
  const T = (s, ...v) => dedent(String.raw(s, ...v));

  const TALK = {
    /* =============================================================== 1 */
    "clean-csv": [
      {
        ask: "We're being asked to open customers_messy.csv and look at the first few rows.",
        know: "Anything with a spreadsheet file starts with pandas. The file's exact name is in the file list on the left.",
        clues: [
          "\"Open a CSV file\" → pandas, Python's spreadsheet tool, and its read_csv command",
          "The file name comes from the file list on the left. Spelling, capitals and the underscore must match exactly",
          "\"Look at the first few rows\" → .head(), which gives the top five",
          "\"Show it on screen\" → print( )"
        ],
        terms: [["import", "bring in a tool someone else already built"], ["pandas", "Python's tool for working with tables"], ["pd", "the short nickname we give pandas"], ["variable", "a labeled box that holds a value, like df"], ["DataFrame (df)", "pandas' word for a table"], ["read_csv", "reads a CSV file into a table"], [".head()", "the first five rows"]],
        talk: T`
          We're being asked to open our messy customer file and look at the first few rows. So here's what we do: load the file with pandas, store it in a variable, and print a preview. And here's why each piece is there.

          First, how do we know to use pandas? Python on its own doesn't really understand spreadsheets. pandas is the tool built for exactly that. So any time a task says CSV, spreadsheet or table, pandas is the first thing we reach for. The line import pandas as pd brings it in and gives it the short nickname pd.

          How do we know what the file is called? Look at the file list on the left. It's customers_messy.csv. We type that exactly, inside quotes, because Python won't guess if we get one letter wrong.

          pd.read_csv reads the file, and we store the result in df. df is a variable, a labeled box, so we can use the table again later just by saying df. People call it df because pandas calls a table a DataFrame.

          Last, the task says "look at the first few rows." In pandas that's .head(), which gives the top five. And we wrap it in print, so it actually shows up on screen. Let's run it.
        `
      },
      {
        ask: "We're being asked to find out how big the table is, and how many blank cells each column has.",
        know: "Questions about size use .shape. Questions about missing values use .isna().",
        clues: [
          "\"How big is it?\" → df.shape, which gives rows, then columns",
          "\"How many blanks?\" → .isna() marks every empty cell, then .sum() counts them per column",
          "Dots in a row (chaining) → each step works on the result of the one before"
        ],
        terms: [["shape", "the size of the table: (rows, columns)"], ["isna", "\"is this cell empty?\" for every cell"], ["sum", "adds things up"], ["NaN", "pandas' word for an empty cell"], ["chaining", "putting several .commands one after another"]],
        talk: T`
          We're being asked to measure the mess: how big is the table, and where are the blanks? So here's what we do: print the table's shape, then count the blank cells in every column. And here's why: before you clean anything, you want "before" numbers, so later you can prove your cleaning worked.

          How do we know which commands? When the question is "how big," pandas has a built-in answer called shape. It gives two numbers: rows first, then columns. Notice there are no parentheses after shape. It's a fact about the table, not an action we're asking it to do.

          When the question is "how many are missing," we use isna, which asks "is this cell empty?" for every cell. Then sum adds up the empty ones in each column. Putting dots one after another like this is called chaining. Each step works on the result of the step before it.

          We get 29 rows and 6 columns. Every column has 3 blanks, and the email column has 6. Keep those numbers in mind, because we're going to fix them.
        `
      },
      {
        ask: "We're being asked to clean up the column names: all lowercase, no extra spaces, and underscores between words.",
        know: "Fixing text uses the .str tools: strip for extra spaces, lower for capitals, replace to swap characters.",
        clues: [
          "\"No extra spaces\" → .str.strip()",
          "\"All lowercase\" → .str.lower()",
          "\"Underscores between words\" → .str.replace(\" \", \"_\"): what to find, then what to put instead",
          "\"Make the change stick\" → save it back with df.columns = ..."
        ],
        terms: [["df.columns", "the list of column names"], [".str", "text tools that work on every value at once"], ["strip", "removes spaces at the start and end"], ["lower", "makes text lowercase"], ["replace", "swaps one piece of text for another"], ["=", "\"store this here\""]],
        talk: T`
          We're being asked to tidy up the column names. So here's what we do: strip off the extra spaces, make every name lowercase, and swap the spaces between words for underscores. And here's why: look at the names from our preview. " Customer ID" has a hidden space at the front, and "EMAIL" is in capitals. Every time we use a column name later, we have to type it exactly. Messy names mean constant typos.

          How do we know which commands to use? Each part of the task maps to one text tool. "No extra spaces" is strip. "Lowercase" is lower. "Underscores instead of spaces" is replace, where we say what to find, a space, and what to put instead, an underscore.

          df.columns is the list of column names. The .str in front tells pandas "do this text operation on every name in the list at once."

          The equals sign at the start matters. It means "store the result back in df.columns." Without it, Python would clean the names and then throw the result away. Last, we print the names to check our work.
        `
      },
      {
        ask: "We're being asked to remove the rows that are completely empty, and turn the customer IDs back into whole numbers.",
        know: "Removing blanks is dropna. Adding how=\"all\" means only rows where every cell is blank get removed.",
        clues: [
          "\"Remove empty rows\" → dropna, which drops rows with blanks",
          "\"Completely empty\" → how=\"all\". Without it, we'd also delete real customers who are only missing an email",
          "IDs showing as 1001.0 → astype(int) turns them into whole numbers",
          "\"How many are left?\" → len( ) counts rows"
        ],
        terms: [["dropna", "drop rows (or columns) that have blanks"], ["how=\"all\"", "only drop a row if every cell is blank"], ["astype", "change a column's type"], ["int", "a whole number, like 1001"], ["len", "how many items there are"]],
        talk: T`
          We're being asked to get rid of the completely empty rows and fix the customer IDs. So here's what we do: drop rows where everything is blank, convert the IDs to whole numbers, and count what's left. And here's why each choice matters.

          How do we know to use dropna? "Drop" plus "na," which is short for not available, so it drops blanks. But here's the careful part. By default, dropna removes any row with even one blank. Some of our real customers are just missing an email. We don't want to lose them. So we add how="all", which means: only drop a row if all of its cells are blank. Reading a task carefully, "completely empty," is how you know you need that extra setting.

          Notice we write df = in front. dropna gives us back a new, cleaned table. If we don't save it into df, the change disappears.

          Next, the IDs. Because blank rows were in the file, pandas stored the IDs as decimals, like 1001.0. Now that the blanks are gone, astype(int) turns them back into whole numbers. int means integer, a whole number.

          Last, len counts the rows. We should have 26 real customers.
        `
      },
      {
        ask: "We're being asked to fix the spacing and capital letters in the name, city and email columns.",
        know: "Same text tools as the column names: strip for spaces, title for names and places, lower for emails.",
        clues: [
          "\"Fix the spacing\" → strip",
          "\"Fix the capitals\" for names and cities → title, which capitalizes Each Word",
          "Emails → lower, because emails are matched exactly and usually stored lowercase",
          "One column at a time → df[\"name\"] picks the name column",
          "Previewing several columns → double square brackets [[ ]]"
        ],
        terms: [["df[\"name\"]", "pick one column by its name"], ["title", "Each Word Starts With A Capital"], ["lower", "all lowercase"], ["[[ ]]", "pick several columns at once"]],
        talk: T`
          We're being asked to clean up the text in three columns: names, cities and emails. So here's what we do: strip the extra spaces from each one, put names and cities in Title Case, and make emails lowercase. And here's why: to a person, "memphis" and "MEMPHIS" are the same city. To a computer they're completely different. If we built a report by city right now, Memphis would show up three times.

          How do we know which tools? We already met strip and lower on the column names. The new one is title. It capitalizes the first letter of each word, which is how names and places are normally written. Emails get lower instead, because email addresses are compared exactly, and lowercase is the standard.

          How do we pick one column? Square brackets with the column name in quotes, like df["name"]. Each line follows the same pattern: grab a column, clean it, and save it back into the same column with the equals sign.

          The last line uses double square brackets. One pair picks a column. The outer pair holds a list of columns, so we can preview all three at once.
        `
      },
      {
        ask: "We're being asked to turn the total_spent column into real numbers we can add up.",
        know: "You can't do math with text. Remove the $ and commas with replace, then convert with astype(float).",
        clues: [
          "\"$1,026.89\" is text, and you can't add up text → we need numbers",
          "Remove characters → .str.replace(what, with what). Replacing with \"\" deletes it",
          "Numbers with decimals → float, so .astype(float)",
          "\"Add it up\" → .sum()"
        ],
        terms: [["float", "a number with a decimal point, like 26.50"], ["regex=False", "treat $ as a normal character"], ["astype(float)", "convert to decimal numbers"], ["sum", "adds up the column"]],
        talk: T`
          We're being asked to turn the money column into real numbers. So here's what we do: remove the dollar signs and commas, convert what's left into numbers, and add them up to prove it worked. And here's why: right now Python sees "$1,026.89" as text, exactly like it sees a word. You can't add up words.

          How do we know to use replace? We need to get rid of two characters. replace swaps one thing for another, and if we replace something with empty quotes, we're deleting it. So we replace the dollar sign with nothing, then the comma with nothing. regex=False just tells pandas to treat the dollar sign as a plain character, because in some search patterns it has a special meaning.

          Then astype(float) converts the text into numbers. Float is Python's word for a number with a decimal point, which is what money needs.

          How do we know it worked? Only real numbers can be added. So we sum the column. If there were still a dollar sign anywhere, the conversion would have stopped with an error instead.
        `
      },
      {
        ask: "We're being asked to turn signup_date into real dates, even though it's written three different ways.",
        know: "pandas' tool for dates is pd.to_datetime. format=\"mixed\" handles several date styles in one column.",
        clues: [
          "\"Turn it into dates\" → pd.to_datetime",
          "Three different styles in one column → format=\"mixed\"",
          "Without it, pandas guesses the style from the first date and errors on the others"
        ],
        terms: [["to_datetime", "turns text into real dates"], ["format=\"mixed\"", "work out each date's style one by one"], ["datetime64", "pandas' label for a real date column"]],
        talk: T`
          We're being asked to turn our sign-up dates into real dates. So here's what we do: convert the column with pandas' date tool, and tell it the dates are written in mixed styles. And here's why: right now they're just text. We can't sort them properly or ask how many people signed up in March.

          How do we know to use to_datetime? It's in the name: convert something "to" a datetime, which is a real date. Whenever a task says "turn this into dates," that's the tool.

          Why format="mixed"? Look at the data. We have 2024-01-10, 01/20/2024 and January 26 2024. Normally pandas looks at the first date, decides that's the style, and then fails on anything different. format="mixed" tells it: work out each date on its own.

          When we print, every date shows up in the same year-month-day style, and at the bottom it says datetime64. That's pandas telling us these are real dates now.
        `
      },
      {
        ask: "We're being asked to fill in the blank emails with the words \"not provided\".",
        know: "Filling blanks is fillna. Whatever you put in the parentheses goes into every empty cell.",
        clues: [
          "\"Fill in the blanks\" → fillna",
          "Keep the customers instead of deleting them, because they're real people who spent money",
          "\"Prove there are none left\" → reuse isna().sum() from step 2"
        ],
        terms: [["fillna", "fill every blank with a value you choose"], ["NaN", "an empty cell"]],
        talk: T`
          We're being asked to deal with the three customers who have no email. So here's what we do: fill those blanks with the words "not provided," then recount the blanks everywhere. And here's why: we could delete those customers, but they're real people who spent real money. A clear label is better than a blank, because anyone who opens the file can see the email is missing on purpose.

          How do we know to use fillna? It's the opposite of dropna. dropna drops blanks, fillna fills them. Whatever we put inside the parentheses goes into every empty cell in that column.

          Then we reuse the blank counter from step 2, isna().sum(). This time every column should say zero. That's our proof the data is complete. Reusing a check like this is a great habit.
        `
      },
      {
        ask: "We're being asked to save the clean table as a new file called customers_clean.csv.",
        know: "We read with read_csv, so we save with to_csv. index=False stops pandas adding a column of row numbers.",
        clues: [
          "\"Save it as a CSV\" → to_csv, the partner of read_csv",
          "Use a new name, so the original stays as a backup",
          "index=False → no mystery column of row numbers"
        ],
        terms: [["to_csv", "writes a table to a CSV file"], ["index", "pandas' row numbers"], ["index=False", "don't save the row numbers"]],
        talk: T`
          We're being asked to save our work as a new file. So here's what we do: write the table to customers_clean.csv, without row numbers, and print a confirmation. And here's why: cleaning only counts if it's saved somewhere your team can use it.

          How do we know to use to_csv? We opened the file with read_csv. The partner for saving is to_csv. A lot of pandas works in pairs like that, read_ and to_.

          Why a new name? We never overwrite the original. If something ever goes wrong, we still have the raw file to start over from.

          Why index=False? pandas keeps its own row numbers, called the index. If we don't say index=False, it saves them as an extra column at the front, and whoever opens the file gets a mystery column of numbers.

          Run it, and watch customers_clean.csv appear on the left. Click it. That's a clean dataset, built by a script you can run again any time.
        `
      }
    ],

    /* =============================================================== 2 */
    "sales-sql": [
      {
        ask: "We're being asked to look at the first 10 rows of the sales table.",
        know: "Click sales.db in the file list. It shows every table inside the database and its columns. That's how you know the table is called sales.",
        clues: [
          "How do I know the table is called sales? Click sales.db on the left. It lists every table, its columns, and how many rows it has",
          "\"Show me\" → SELECT",
          "\"Every column\" → *",
          "\"From which table\" → FROM sales",
          "\"Only 10 rows\" → LIMIT 10",
          "At work, table names come from your company's database tool, a data guide, or a teammate. You always look before you write"
        ],
        terms: [["database", "a file that holds one or more tables"], ["table", "like one spreadsheet tab: rows and columns"], ["SELECT", "\"show me\""], ["*", "every column"], ["FROM", "which table to look in"], ["LIMIT", "only show this many rows"], [";", "the end of the question"]],
        talk: T`
          We're being asked to look at the first 10 rows of the sales table. So here's what we do: select every column from the sales table, and limit it to 10 rows. And here's why: you can't answer questions about data until you know what's in it.

          But first, how do we even know the table is called sales? Click sales.db in the file list on the left. A database file can hold lots of tables, and this view lists every one. Here there's just one, called sales, with 150 rows, and underneath are all its column names. In a real job you'd see the same thing in your company's database tool, or in a document that describes the data. Always look before you write.

          Now the query. Read it like a sentence: select everything from sales, limit 10. SELECT means "show me." The star means "every column." FROM sales says which table. LIMIT 10 means just the first 10 rows, which is a good habit, because real tables can have millions.

          The semicolon at the end is like a period. It tells the database the question is finished. SQL keywords are usually written in capitals so they're easy to spot. That's a habit, not a rule.
        `
      },
      {
        ask: "We're being asked to show the date, product and quantity for orders from the South region only.",
        know: "When a question narrows things down, like \"only,\" \"just\" or \"from the South,\" you need WHERE. WHERE filters rows.",
        clues: [
          "\"Only the South\" → we're filtering rows → WHERE",
          "\"Date, product and quantity\" → list those columns after SELECT instead of *",
          "Column names and values come from step 1's results, or from clicking sales.db",
          "'South' goes in quotes because it's text, with a capital S exactly as it's stored"
        ],
        terms: [["WHERE", "keep only the rows that match"], ["condition", "the test after WHERE, like region = 'South'"], ["'South'", "text values go in single quotes"]],
        talk: T`
          We're being asked to show the date, product and quantity, but only for orders from the South. So here's what we do: list those three columns, and add a WHERE filter for region equals South. And here's why each piece is there.

          How do we know to use WHERE? Listen for the word "only." Any time a question narrows things down, like only the South, just this month, or orders over 5, that's a filter on rows. In SQL, the filter is always WHERE. An easy way to remember it: SELECT picks the columns, WHERE picks the rows.

          How do we know the column is called region, and that the value is South with a capital S? From step 1. We saw a region column, and the values were North, South, East and West. Text values go in single quotes, and they have to match exactly, so lowercase 'south' would find nothing.

          Instead of the star, we list just the three columns the question asked for, separated by commas. And we split the query across three lines only to make it easier to read. SQL doesn't stop until it reaches the semicolon.
        `
      },
      {
        ask: "We're being asked to find the 5 orders with the largest quantity, biggest first.",
        know: "Words like \"biggest,\" \"top,\" \"highest\" or \"most recent\" mean sorting: ORDER BY. DESC puts the biggest first.",
        clues: [
          "\"Biggest first\" → sorting → ORDER BY quantity",
          "Biggest at the top → DESC, short for descending. Without it, the smallest comes first",
          "\"Top 5\" → LIMIT 5",
          "The order of the words is always SELECT, FROM, WHERE, ORDER BY, LIMIT"
        ],
        terms: [["ORDER BY", "sort the results"], ["DESC", "descending: biggest first"], ["ASC", "ascending: smallest first (the default)"], ["LIMIT", "keep only the first few rows"]],
        talk: T`
          We're being asked for our five biggest orders, biggest first. So here's what we do: sort every order by quantity, flip it so the biggest are on top, and keep the first five. And here's why: "what were our biggest orders?" is one of the most common questions a manager asks.

          How do we know to use ORDER BY? Any time a question says biggest, smallest, top, highest or most recent, it's asking us to sort. In SQL, sorting is ORDER BY, followed by the column to sort on.

          Why DESC? By default, ORDER BY goes smallest to biggest. DESC, short for descending, flips it, so the biggest come first. If you ever get the right rows upside down, a missing DESC is usually why.

          Then LIMIT 5 keeps just the top five. Put those together and you've got a top-five list. The words always go in the same order: SELECT, FROM, WHERE if you have one, ORDER BY, then LIMIT.
        `
      },
      {
        ask: "We're being asked to work out revenue, quantity times price, for each order, and show the top 5.",
        know: "When the number you need isn't a column, calculate it right in the SELECT. AS gives the new column a name.",
        clues: [
          "There's no revenue column (check sales.db) → we have to calculate it",
          "Revenue = quantity × unit_price → in code, multiply is *",
          "\"Call it revenue\" → AS revenue",
          "\"Top 5\" again → ORDER BY revenue DESC LIMIT 5"
        ],
        terms: [["* (between columns)", "multiply"], ["AS", "give a column a name"], ["calculated column", "a new column made from math on other columns"]],
        talk: T`
          We're being asked to find our top five orders by revenue, which is quantity times price. So here's what we do: multiply the two columns, name the result revenue, and sort by it. And here's why: selling 40 cheap mugs might bring in less money than 10 expensive bags. Revenue is what the business actually cares about.

          How do we know we have to calculate it? Look at the columns in sales.db. There's quantity and there's unit_price, but no revenue column. When the number you need isn't stored, you make it yourself, right inside the SELECT.

          In code, the star between two columns means multiply. Yes, it's the same symbol as "every column" from step 1. SQL can tell the difference: on its own after SELECT it means everything, between two values it means multiply.

          Then AS revenue gives our new column a name. Without it, the column would be called "quantity * unit_price," which looks messy in a report. And now that it has a name, we can sort by it.
        `
      },
      {
        ask: "We're being asked for two headline numbers: how many orders there are, and the total revenue.",
        know: "\"How many\" means COUNT. \"Total\" means SUM. Both squash many rows into one answer.",
        clues: [
          "\"How many orders?\" → COUNT(*) counts rows, and each row is one order",
          "\"Total revenue\" → SUM( ) adds up the revenue math from step 4",
          "One answer for the whole table → no GROUP BY needed"
        ],
        terms: [["COUNT(*)", "how many rows"], ["SUM", "add up a column"], ["aggregate", "a function that turns many rows into one number"]],
        talk: T`
          We're being asked for the two headline numbers: how many orders, and how much money. So here's what we do: count the rows, and add up the revenue, in one query. And here's why: every report starts with "how many and how much."

          How do we know which functions? The question tells us. "How many" is counting, so COUNT. "Total" is adding, so SUM. Those two words will come up constantly, and they map straight to those two functions.

          COUNT star counts every row. Since every row in our table is one order, that's our number of orders. SUM adds things up, and we sum the same revenue math from the last step: quantity times unit_price.

          Notice we only get one row back. COUNT and SUM are called aggregate functions. They squash many rows into a single answer.
        `
      },
      {
        ask: "We're being asked for total revenue for each region, highest first.",
        know: "The words \"for each\" or \"by\" mean GROUP BY. It's SQL's version of a pivot table.",
        clues: [
          "\"For each region\" or \"revenue by region\" → GROUP BY region",
          "\"Total revenue\" inside each group → SUM",
          "\"Highest first\" → ORDER BY revenue DESC",
          "Rule of thumb: any column in SELECT that isn't inside SUM or COUNT goes in GROUP BY"
        ],
        terms: [["GROUP BY", "put rows into piles, one per value"], ["group", "one pile, like all South orders"], ["pivot table", "Excel's version of the same idea"]],
        talk: T`
          We're being asked for total revenue for each region, best region first. So here's what we do: group the orders by region, add up the revenue in each group, and sort. And here's why: "which region is doing best?" is a classic manager question.

          How do we know to use GROUP BY? Listen for "for each" or "by." Revenue for each region. Sales by month. Orders per customer. Every time you hear that, it's GROUP BY. If you've used a pivot table in Excel, it's the same idea.

          GROUP BY region puts all the orders into piles, one pile per region. Then SUM adds up the revenue inside each pile separately. So instead of one total, we get four.

          Here's a rule that saves a lot of errors: any column you SELECT that isn't inside SUM or COUNT should also be in GROUP BY. Here that's region. Then we sort, so the best region is on top.
        `
      },
      {
        ask: "We're being asked, for each category, how many units sold and how much revenue, rounded to 2 decimals, highest revenue first.",
        know: "\"For each category\" means GROUP BY category. You can calculate several totals per group. \"Rounded\" means ROUND.",
        clues: [
          "\"For each category\" → GROUP BY category",
          "\"Units sold\" → SUM(quantity)",
          "\"Revenue\" → SUM(quantity * unit_price)",
          "\"Rounded to 2 decimals\" → ROUND(..., 2)"
        ],
        terms: [["ROUND(x, 2)", "round to 2 decimal places"], ["units", "how many items"], ["revenue", "how much money"]],
        talk: T`
          We're being asked which category does best, Coffee, Tea, Bakery or Merch, by units and by money. So here's what we do: group by category, calculate two totals for each, round the money, and sort. And here's why: this tells the owner what to restock, promote, or drop.

          How do we know what to write? "For each category" is our GROUP BY signal again. Then the question asks for two things per group, so we calculate two things. Units sold is SUM of quantity. Revenue is SUM of quantity times price, the same math as before.

          "Rounded to 2 decimals" tells us to use ROUND. We wrap the revenue in ROUND, and the 2 means two decimal places, like real money.

          Here's an insight to point out: the category that sells the most units isn't always the one that makes the most money. That's exactly why we asked for both.
        `
      },
      {
        ask: "We're being asked for total revenue for each month, from January to June.",
        know: "\"Each month\" means GROUP BY month. Dates include the day, so first pull out just the year and month with strftime.",
        clues: [
          "\"For each month\" → GROUP BY month",
          "Dates look like 2025-03-14, but we need 2025-03 → strftime('%Y-%m', order_date)",
          "\"In order\" → ORDER BY month, oldest first by default",
          "You can GROUP BY a name you made with AS"
        ],
        terms: [["strftime", "format a date the way you want"], ["%Y", "the year, like 2025"], ["%m", "the month, like 03"], ["trend", "how something changes over time"]],
        talk: T`
          We're being asked for revenue for each month, January to June. So here's what we do: turn each order date into just its year and month, group by that, add up revenue, and sort by month. And here's why: "are we growing?" is the question every owner asks.

          How do we know to use GROUP BY? "For each month." Same signal as before. But there's a catch. Our dates include the day, like 2025-03-14. If we grouped by the full date, we'd get a pile for every single day.

          So we need just the year and month, 2025-03. That's what strftime does. It reformats a date. The '%Y-%m' part is a pattern: %Y means the year, then a dash, then %m means the month. We name the result month with AS.

          Then we group by month and sort by month, so it reads January through June. Six rows that tell the story of the business, and exactly what you'd hand someone to make a line chart.
        `
      }
    ],

    /* =============================================================== 3 */
    "weather-api": [
      {
        ask: "We're being asked to ask a weather service for New York's current temperature and wind, and check that it answered.",
        know: "Getting data from a website in code is requests.get. The service's documentation tells you its address and what details to send.",
        clues: [
          "\"Get data from a website\" → requests, Python's tool for calling websites",
          "How do I know the address and the param names? From the API's documentation. Open-Meteo's docs list latitude, longitude, current, and the unit options",
          "Details as labels and values → a dictionary, with curly brackets { }",
          "\"Did it work?\" → response.status_code. 200 means OK"
        ],
        terms: [["API", "a website made for programs to ask questions"], ["URL", "the address we call"], ["params", "the details we send with the request"], ["dictionary", "labels and values, like a form"], ["status code", "200 = OK, 404 = not found"]],
        talk: T`
          We're being asked to get New York's current weather from a weather service, and make sure it answered. So here's what we do: build the address and the details, send the request, and print the status code. And here's why each piece is there.

          How do we know to use requests? Our code needs to talk to another computer on the internet. requests is the standard Python tool for that. So whenever a task says "get data from an API," requests.get is the move. Get just means "go fetch."

          How do we know the address, and words like latitude and current? Every API has documentation, basically an instruction manual. Open-Meteo's manual says: send a latitude and a longitude, list the current values you want, like temperature_2m, and optionally pick your units. We're following the manual. In a real job, reading the docs is always step one with a new API.

          params uses curly brackets, which makes a dictionary. A dictionary is labels and values, like filling out a form. New York is latitude 40.71, longitude -74.01.

          Last, how do we know it worked? Every response comes with a status code. 200 means OK. You've probably seen 404, which means not found. So we check the status first, before we trust the data.
        `
      },
      {
        ask: "We're being asked to turn the API's answer into something Python can read, and look at it.",
        know: "APIs answer in a format called JSON. response.json() turns it into a Python dictionary.",
        clues: [
          "APIs send their answer as JSON text → .json() converts it into a Python dictionary",
          "Look at the whole thing first, so you can see where the numbers live before grabbing them"
        ],
        terms: [["JSON", "text organized as labels and values; almost every API uses it"], ["dictionary", "Python's version of labels and values"], ["nested", "a dictionary inside a dictionary"]],
        talk: T`
          We're being asked to turn the API's answer into something Python can work with, and look at it. So here's what we do: convert the response with .json(), store it, and print it. And here's why: we can't pull out the temperature until we know where it is.

          How do we know to use .json()? APIs almost always answer in a format called JSON. It's text, organized with labels and values. response.json() turns that text into a Python dictionary, so Python can work with it.

          Why print the whole thing? Because every API shapes its answer differently. Look at the output. There's a section called "current," and inside it are temperature_2m and wind_speed_10m. That's a dictionary inside a dictionary, which is called nested. Think of folders inside folders. Now we know exactly which folder to open in the next step.
        `
      },
      {
        ask: "We're being asked to pull out the temperature and wind speed, and print them as a sentence.",
        know: "To get a value out of a dictionary, use square brackets with its label. Stack them to go deeper: data[\"current\"][\"temperature_2m\"].",
        clues: [
          "In the printout, the numbers sit inside \"current\" → data[\"current\"]",
          "Inside that, the labels are temperature_2m and wind_speed_10m → add a second [ ]",
          "Copy the exact labels from step 2's printout. Don't guess",
          "Mixing words and variables in one sentence → an f-string"
        ],
        terms: [["[ ]", "look up a value by its label"], ["key", "a label in a dictionary"], ["f-string", "a sentence with variables dropped in using { }"]],
        talk: T`
          We're being asked to pull out just the temperature and wind, and say them in a sentence. So here's what we do: reach into the data to grab each number, store them in variables, and print a sentence. And here's why: raw data is for computers, a sentence is for people.

          How do we know what to type? We look back at the printout from the last step. The numbers live inside "current," so data square-bracket "current" opens that folder. Inside it, the temperature is labeled temperature_2m, so we add a second set of square brackets with that label. Same for wind. We copy the labels exactly from the printout. Never guess, because one wrong letter gives an error.

          The print line uses an f-string. See the little f before the quotes? That lets us drop variables right into the sentence with curly brackets. So {temp} gets swapped for the real temperature.
        `
      },
      {
        ask: "We're being asked to wrap our request in a reusable function that works for any city.",
        know: "When you'll do the same steps more than once with different inputs, write a function with def.",
        clues: [
          "\"Any city\" means repeating the same steps → a function",
          "The inputs that change, lat and lon → go in the parentheses after the name",
          "Hand back a result → return",
          "Stop loudly if the API sends an error → response.raise_for_status()"
        ],
        terms: [["def", "define a new function"], ["parameter", "an input to a function, like lat"], ["return", "hand a result back"], ["indentation", "the spaces that show what's inside the function"], ["raise_for_status", "stop with an error if the request failed"]],
        talk: T`
          We're being asked to make our weather lookup reusable, so it works for any city. So here's what we do: wrap the request in a function that takes a latitude and longitude, and returns the current weather. And here's why: we need six cities. Copying the same code six times is messy, and if we ever changed one thing, we'd have to change it in six places.

          How do we know to write a function? Whenever you'll do the same steps more than once with different inputs, that's a function. def means "define a function," and we name it get_weather. lat and lon in the parentheses are the inputs that change each time.

          Notice the indentation. Everything pushed in under def belongs to the function. That's how Python knows where it starts and stops.

          raise_for_status is a safety check. If the API ever sends back an error, our script stops and tells us, instead of quietly carrying on with bad data. return hands the result back to whoever called the function. Then we test it on Chicago.
        `
      },
      {
        ask: "We're being asked to get the weather for every city in cities.csv, and collect the results.",
        know: "\"For every\" means a loop. Reading a CSV row by row with labels is csv.DictReader.",
        clues: [
          "\"Every city\" → a for loop",
          "The cities come from a file → open it, and csv.DictReader hands us each row with labels",
          "Click cities.csv on the left to see its column names: city, lat, lon",
          "\"Collect the results\" → start with an empty list [ ] and .append to it"
        ],
        terms: [["for loop", "do the indented code once for each item"], ["list", "an ordered collection, written with [ ]"], ["append", "add an item to the end of a list"], ["with open", "open a file and close it automatically"], ["DictReader", "reads each CSV row as a dictionary"]],
        talk: T`
          We're being asked to get the weather for every city in our file, and collect the results. So here's what we do: open cities.csv, loop through each row, call our function, and add each result to a list. And here's why: this is automation. One script does six lookups, and it would do 600 just as easily.

          How do we know to use a loop? The word "every." For every city, do the same thing. In Python that's a for loop: for row in, then the indented code runs once per row.

          How do we know the column names? Click cities.csv on the left. The first line is the header: city, lat, lon. That's why we write row["city"] and row["lat"]. csv.DictReader reads each row as a dictionary, so we can use those names instead of remembering positions.

          results starts as an empty list, the square brackets. Each time through the loop, append adds a small dictionary to the end. Watch the output: six cities, six API calls, and we wrote the code once.
        `
      },
      {
        ask: "We're being asked to find which city is warmest right now.",
        know: "\"Highest,\" \"biggest\" or \"warmest\" means max. key tells max which value to compare.",
        clues: [
          "\"Warmest\" means highest temperature → max( )",
          "Our items are dictionaries, so max needs to know which value to compare → key=",
          "lambda r: r[\"temp_f\"] means \"for each result r, look at its temp_f\""
        ],
        terms: [["max", "the biggest item"], ["key", "what to compare by"], ["lambda", "a tiny one-line function"]],
        talk: T`
          We're being asked which city is warmest right now. So here's what we do: use max to find the result with the highest temperature, and print it. And here's why: data is only useful when it answers a question.

          How do we know to use max? Warmest means the highest temperature, and max finds the biggest item. But our items are dictionaries, not plain numbers. Python can't tell what "biggest dictionary" means. So we give max a key: the thing to compare by.

          The lambda part looks scary, but it's just a tiny one-line function. Read it as: for each result r, look at its temp_f. So max compares the temperatures, and hands back the whole dictionary for the warmest city. Then we print the city's name and temperature.
        `
      },
      {
        ask: "We're being asked to save the results as a file called weather_report.csv.",
        know: "We read the cities with DictReader, so we write with DictWriter. \"w\" opens a file for writing.",
        clues: [
          "\"Save as a CSV\" → the csv module, with the file opened in \"w\" mode",
          "Our results are dictionaries → DictWriter, the partner of DictReader",
          "Column names first → writeheader(), then every row → writerows()"
        ],
        terms: [["\"w\"", "open the file for writing"], ["newline=\"\"", "stops blank lines appearing on Windows"], ["DictWriter", "writes dictionaries as CSV rows"], ["fieldnames", "the column names, in order"]],
        talk: T`
          We're being asked to save our results as a report. So here's what we do: create a new CSV file, write the column names, then write every city's row. And here's why: a printout disappears. A saved file can be emailed, opened in Excel, or loaded into a dashboard.

          How do we know to use DictWriter? We read the cities with DictReader. Our results are dictionaries too, so the partner tool for writing them is DictWriter. We tell it our column names with fieldnames.

          We open the file with "w," which means write. newline equals empty quotes just stops Windows from adding blank lines between rows.

          writeheader writes the column names as the first row, and writerows writes every dictionary in our results list. Run it, and weather_report.csv appears on the left. In a real job, you could schedule this to run every morning.
        `
      }
    ],

    /* =============================================================== 4 */
    "duplicates": [
      {
        ask: "We're being asked to read signups.csv and count how many sign-ups there are.",
        know: "Plain Python reads CSV files with the csv module. len( ) counts the items in a list.",
        clues: [
          "The file name is in the file list on the left: signups.csv",
          "This project uses plain Python, no pandas, so we learn the building blocks → the csv module",
          "\"How many?\" → len( )",
          "\"Show me one\" → rows[0], because Python counts from 0"
        ],
        terms: [["csv module", "Python's built-in tool for CSV files"], ["DictReader", "reads each row with its column labels"], ["list", "everything in order, in [ ]"], ["len", "how many items"], ["rows[0]", "the first item; Python counts from 0"]],
        talk: T`
          We're being asked to read our sign-up file and count the sign-ups. So here's what we do: open signups.csv, read every row into a list, and print the count and the first row. And here's why: we need every sign-up loaded before we can compare them.

          How do we know which tool? This time we're using plain Python, without pandas, so you learn the building blocks underneath. Python has a built-in csv module for reading spreadsheet files. csv.DictReader reads each row as a dictionary, so every row has labels: name, email, phone, event and signup date.

          Wrapping it in list puts every row into one list called rows.

          "How many" is len, short for length. And to look at one row, we use rows[0]. Python starts counting at zero, not one. That trips up everyone at first, so it's worth saying out loud.
        `
      },
      {
        ask: "We're being asked to find rows that are exact copies of an earlier row.",
        know: "\"Have I seen this before?\" is exactly what a set is for.",
        clues: [
          "\"Exactly the same as an earlier row\" → remember every row we've seen → a set",
          "Check every row → a for loop",
          "\"Seen it before?\" → if key in seen",
          "A set can't hold a dictionary, so we turn the row's values into a tuple first"
        ],
        terms: [["set", "a collection that's very fast at \"is this in here?\""], ["tuple", "a fixed list of values, written with ( )"], ["in", "checks if something is inside a collection"], ["if / else", "do one thing or the other"]],
        talk: T`
          We're being asked to find the rows that are exact copies, where someone clicked submit twice. So here's what we do: go through every row, remember each one we've seen, and collect any row we've seen before. And here's why: exact copies are the easiest duplicates to catch, so we start there.

          How do we know to use a set? The question we keep asking is "have I seen this before?" A set is built for exactly that. It's like a list, but super fast at answering "is this in here?"

          We loop through the rows. tuple(row.values()) turns the row into a single value the set can store, like taking a fingerprint of the row. A set can't hold a dictionary directly, which is why we need this step.

          Then the if: if this fingerprint is already in seen, it's a duplicate, so we add it to exact_dupes. Otherwise, else, we add the fingerprint to seen, so we'll recognize it next time.
        `
      },
      {
        ask: "We're being asked to write a small function that cleans up an email before we compare it.",
        know: "When the same value can be typed different ways, clean it the same way every time before comparing. A function guarantees that.",
        clues: [
          "Hidden duplicates only differ by spaces and capitals → strip and lower",
          "We'll clean lots of emails → put it in a function",
          "Test it on one messy example before using it everywhere"
        ],
        terms: [["def", "define a function"], ["return", "hand back the result"], ["strip", "remove spaces at the start and end"], ["lower", "make lowercase"], ["normalize", "make values consistent before comparing"]],
        talk: T`
          We're being asked to write a function that cleans up an email. So here's what we do: remove the extra spaces, make it lowercase, and return the clean version. And here's why: some people signed up twice but typed their email a bit differently. To a computer, "Tom.Becker@Example.com" with a space at the end and "tom.becker@example.com" are different people.

          How do we know what cleaning to do? Look at the differences: spaces and capital letters. strip handles spaces, lower handles capitals. Cleaning values so they can be compared fairly has a name: normalizing.

          Why a function? We'll clean every email in the file, and we want it done the exact same way every time. def starts the function, email is the input, and return hands back the result.

          Then we test it on one messy email. Testing a small piece before using it everywhere is a habit that saves hours.
        `
      },
      {
        ask: "We're being asked to count how many times each person signed up, and list the people who appear more than once.",
        know: "\"How many times each\" is tallying, and a dictionary is a tally sheet: each label gets a count.",
        clues: [
          "\"How many times each\" → a dictionary of email → count",
          "counts.get(email, 0) → the current count, or 0 if this email is new",
          "\"More than once\" → n > 1",
          "Building a filtered list in one line → a list comprehension"
        ],
        terms: [["dictionary", "labels and values; here, email → count"], [".get(x, 0)", "look up x, or use 0 if it's not there"], [".items()", "every label and value, in pairs"], ["list comprehension", "build a list in one line: [this for that if test]"]],
        talk: T`
          We're being asked how many times each person signed up, and who signed up more than once. So here's what we do: tally every cleaned email in a dictionary, then pull out the ones with a count over one. And here's why: counting by the clean email finds every duplicate, including the hidden ones.

          How do we know to use a dictionary? "How many times each" is tallying. A dictionary is a tally sheet: each email is a label, and its value is the count.

          For each row, we clean the email with our function. Then counts.get(email, 0) means "look up this email's count, or use zero if it's new." We add one, and save it back.

          The next line is a list comprehension. Read it as a sentence: give me each email, for every email and count in our tally, if the count is more than one.

          We go from 4 exact duplicates to 8 people who signed up more than once. The cleaning found the hidden ones.
        `
      },
      {
        ask: "We're being asked to build a clean list with just one sign-up per person.",
        know: "It's the same set pattern as step 2, but we compare the cleaned email instead of the whole row.",
        clues: [
          "\"One per person\" → keep a set of emails we've already kept",
          "Same shape as step 2, so we reuse the pattern",
          "Compare clean_email(...) so hidden duplicates match",
          "Keep the first sign-up, skip the rest"
        ],
        terms: [["not in", "true if something isn't in the collection yet"], ["append", "add to the end of a list"]],
        talk: T`
          We're being asked for a clean list, one sign-up per person. So here's what we do: go through every row, keep it only if we haven't kept that person yet, and compare before and after. And here's why: now we know who's duplicated, this builds the list the events team would actually use.

          How do we know what to write? This is the same pattern as step 2, on purpose. A set remembers who we've already kept. The difference is what we compare: instead of the whole row, we compare the cleaned email, so the hidden duplicates match.

          If the email is not in kept yet, it's someone new, so we keep their row and remember their email. If we've seen them, we skip them. That means we always keep each person's first sign-up.

          Then we print before and after: 37 sign-ups, but only 28 real people.
        `
      },
      {
        ask: "We're being asked to save a report listing each duplicated email and how many times it signed up.",
        know: "Writing a CSV uses the csv module with the file in \"w\" mode. For plain lists of values, use csv.writer.",
        clues: [
          "\"Save a report\" → write a new CSV file",
          "Each row here is a plain list, [email, count] → csv.writer",
          "Column names first → writerow([...])",
          "The counts come from our tally dictionary"
        ],
        terms: [["csv.writer", "writes plain lists as CSV rows"], ["writerow", "write one row"]],
        talk: T`
          We're being asked to save a report of who was duplicated. So here's what we do: create a new CSV, write a header row, then one row per duplicated email with its count. And here's why: good data work is checkable work. Your team should be able to see exactly what you found.

          How do we know to use csv.writer? Each row we're writing is a simple list: an email and a number. csv.writer writes lists as rows. The first writerow is the header, email and times signed up.

          Then we loop through our duplicate emails and write each one, along with its count, which we look up in our tally dictionary.

          Open the file on the left. You'll see Priya signed up three times. Without this script, nobody would have noticed.
        `
      },
      {
        ask: "We're being asked to save the clean list as signups_clean.csv, with the same columns as the original.",
        know: "Our rows are dictionaries, so we use DictWriter. rows[0].keys() borrows the original column names.",
        clues: [
          "The rows are dictionaries → DictWriter",
          "\"Same columns as the original\" → fieldnames=rows[0].keys()",
          "A new file name, so the original stays untouched"
        ],
        terms: [["DictWriter", "writes dictionaries as CSV rows"], [".keys()", "a dictionary's labels"], ["writerows", "write many rows at once"]],
        talk: T`
          We're being asked to save the clean list, with the same columns as the original. So here's what we do: write unique_rows to a new file, borrowing the column names from the original. And here's why: this is the deliverable, a clean list ready for name tags, emails and an accurate headcount.

          How do we know to use DictWriter? Our rows are dictionaries, the way DictReader gave them to us. DictWriter is its partner for writing.

          How do we keep the same columns? We borrow them from the first row with rows[0].keys(). keys means the labels in a dictionary, so our clean file gets exactly the same columns, in the same order.

          writeheader writes the column names, and writerows writes all 28 people. And just like before, it's a new file. The original stays untouched as a backup.
        `
      }
    ],

    /* =============================================================== 5 */
    "relational-db": [
      {
        ask: "We're being asked to create a table for owners, with a unique ID, a name and a phone number.",
        know: "Making a new table is CREATE TABLE. Every table gets an ID column marked PRIMARY KEY.",
        clues: [
          "\"Create a table\" → CREATE TABLE",
          "Every column needs a name and a type: INTEGER for whole numbers, TEXT for words",
          "\"Unique ID\" → PRIMARY KEY",
          "\"A name is required\" → NOT NULL",
          "Phone is TEXT, not a number, because of the dashes, and you never do math with a phone number"
        ],
        terms: [["CREATE TABLE", "make a new, empty table"], ["INTEGER", "a whole number"], ["TEXT", "words or characters"], ["PRIMARY KEY", "the unique ID for each row"], ["NOT NULL", "this value is required"]],
        talk: T`
          We're being asked to create our first table, for pet owners. So here's what we do: make a table called owners with three columns, an ID, a name and a phone number, and set the rules for each. And here's why: a database starts as an empty file. Tables are how we decide what it will hold.

          How do we know the command? Making a new table is CREATE TABLE, followed by its name. Inside the parentheses we list the columns, separated by commas. Each one gets a name and a type: INTEGER for whole numbers, TEXT for words.

          Why is phone TEXT and not a number? Phone numbers have dashes, and you never do math with them. A good rule: if you won't add it up, it's probably text.

          owner_id is special. The task says "unique ID," and in SQL that's PRIMARY KEY. No two owners can ever share an ID. It's like a customer number, and other tables will use it to point to an owner.

          NOT NULL on name means a name is required. The database won't save an owner without one.
        `
      },
      {
        ask: "We're being asked to create a pets table where each pet points to its owner.",
        know: "When one table \"belongs to\" or \"points to\" another, store the other table's ID and mark it as a FOREIGN KEY.",
        clues: [
          "\"Each pet belongs to an owner\" → store owner_id, not the owner's name and phone",
          "\"Points to the owners table\" → FOREIGN KEY (owner_id) REFERENCES owners(owner_id)",
          "The pet's own ID → pet_id INTEGER PRIMARY KEY"
        ],
        terms: [["FOREIGN KEY", "a column that points to another table's ID"], ["REFERENCES", "says which table and column it points to"], ["relationship", "one owner can have many pets"]],
        talk: T`
          We're being asked to create a pets table, where each pet points to its owner. So here's what we do: give each pet its own ID, a name and a species, plus an owner_id that links to the owners table. And here's why: this link is the "relational" part of a relational database.

          How do we know to store owner_id instead of the owner's name? If we typed Maya's name and phone into every pet row, and her number changed, we'd have to fix it everywhere. Storing just her ID means her details live in one place, the owners table.

          How do we make the link official? The task says each pet points to an owner. In SQL that's a FOREIGN KEY. The last line says: owner_id in this table refers to owner_id in the owners table. Now the database will refuse to save a pet that points to an owner who doesn't exist.

          So, a primary key is a table's own ID. A foreign key is a pointer to another table's ID. That's the whole secret.
        `
      },
      {
        ask: "We're being asked to create a visits table where each visit points to a pet, with a date, reason and cost.",
        know: "Same pattern again: its own ID, plus a foreign key to the table it belongs to. Money uses REAL.",
        clues: [
          "Each visit belongs to a pet → pet_id, plus a FOREIGN KEY to pets",
          "Cost has cents → REAL",
          "Dates are TEXT written as YYYY-MM-DD, so they sort in the right order"
        ],
        terms: [["REAL", "a number with decimals"], ["chain", "visits → pets → owners"]],
        talk: T`
          We're being asked to create a table for visits, where each visit points to a pet. So here's what we do: its own ID, a pet_id that links to pets, and columns for the date, reason and cost. And here's why: this completes a chain. A visit points to a pet, and a pet points to an owner.

          How do we know what to write? It's the same pattern as pets. "Each visit belongs to a pet" tells us we need pet_id, and a FOREIGN KEY pointing to the pets table.

          How do we pick the types? Cost has cents, so it's REAL, the type for decimal numbers. The date is TEXT, and we'll write dates as year-month-day, because written that way they sort correctly even as text.

          Because of the chain, we'll be able to follow a visit all the way back to the owner who paid for it.
        `
      },
      {
        ask: "We're being asked to add four owners to the owners table.",
        know: "Adding rows is INSERT INTO ... VALUES. List the columns, then the values in the same order.",
        clues: [
          "\"Add rows\" → INSERT INTO",
          "Name the columns you're filling, then VALUES in the same order",
          "Several rows at once → separate them with commas, one semicolon at the very end",
          "Owners go first, because pets have to point to owners that already exist"
        ],
        terms: [["INSERT INTO", "add new rows to a table"], ["VALUES", "the data for each new row"]],
        talk: T`
          We're being asked to add four owners. So here's what we do: one INSERT statement with four rows of values. And here's why: our tables exist, but they're empty.

          How do we know the command? Adding rows to a table is always INSERT INTO, then the table name. In parentheses, we list which columns we're filling in. After VALUES, each set of parentheses is one row, in the same order as the columns.

          We can add several rows at once by separating them with commas. Only the very last one gets the semicolon.

          Why owners first? Because of the foreign key we set up. A pet has to point to an owner who already exists, so the owners need to be there before the pets.
        `
      },
      {
        ask: "We're being asked to add six pets, each linked to its owner.",
        know: "Same INSERT pattern. The last number in each row is the owner_id, which is the link.",
        clues: [
          "Same as the last step → INSERT INTO pets",
          "Which owner? → their owner_id from the step before. Maya is 1, Derek is 4",
          "Try an owner_id of 99 to watch the foreign key block it, then change it back"
        ],
        terms: [["link", "the owner_id stored on each pet"], ["constraint", "a rule the database enforces, like the foreign key"]],
        talk: T`
          We're being asked to add six pets, each linked to an owner. So here's what we do: the same INSERT pattern, where the last value in each row is the owner's ID. And here's why: that number is the link between the two tables.

          How do we know which number to use? From the owners we just added. Maya is owner 1, so Biscuit and Mochi get 1. Derek is owner 4, so Luna and Rex get 4.

          Here's the beauty of it. Maya has two pets, but her name and phone are stored only once. If her number changes, we update one row and every pet stays connected.

          Try this on camera: change one owner_id to 99 and run it. The database refuses, because owner 99 doesn't exist. That's the foreign key protecting the data. Then change it back.
        `
      },
      {
        ask: "We're being asked to add eight visits, each linked to a pet.",
        know: "Same INSERT pattern. The second number in each row is the pet_id.",
        clues: [
          "Same pattern again → INSERT INTO visits",
          "Which pet? → the pet_id from the step before. Biscuit is 1",
          "Dates as 'YYYY-MM-DD' text, in quotes"
        ],
        terms: [["'2026-01-14'", "a date written year-month-day, so it sorts correctly"]],
        talk: T`
          We're being asked to add eight visits, each linked to a pet. So here's what we do: one more INSERT, where the second value in each row is the pet's ID. And here's why: now the database has a history we can ask questions about.

          How do we know which pet each visit belongs to? The pet_id. Pet 1 is Biscuit, and Biscuit shows up three times. That's one busy dog.

          The dates are written year, month, day, inside quotes because they're text. Written that way, they sort in the right order.

          Notice one pet never shows up in this list. Keep that in your back pocket, because we're going to find that pet with a query at the end.
        `
      },
      {
        ask: "We're being asked to list every pet's name next to its owner's name.",
        know: "When the answer needs columns from two tables, use JOIN, and match them with ON using the ID that links them.",
        clues: [
          "Pet names are in pets, owner names are in owners → two tables → JOIN",
          "How do they match? → ON pets.owner_id = owners.owner_id, the link we built",
          "Both tables have a column called name → say which one: pets.name, owners.name",
          "Clear labels → AS pet, AS owner"
        ],
        terms: [["JOIN", "combine rows from two tables"], ["ON", "the rule for matching rows"], ["table.column", "say which table a column comes from"]],
        talk: T`
          We're being asked to show every pet next to its owner's name. So here's what we do: join the pets table to the owners table, matching on owner_id. And here's why: the pet names are in one table and the owner names are in another. We need both.

          How do we know to use JOIN? Any time the answer needs columns from two different tables, that's a JOIN. FROM pets JOIN owners says we're using both.

          How does SQL know which owner goes with which pet? The ON part. A pet's owner_id has to equal an owner's owner_id. That's the link we built in step 2, now being used.

          Since both tables have a column called name, we have to say which one we mean. pets.name means the name from pets, and owners.name means the name from owners. Then AS gives them clear labels, pet and owner.
        `
      },
      {
        ask: "We're being asked, for each owner, how many visits they've had and how much they've spent, biggest spender first.",
        know: "Owners connect to visits through pets, so JOIN all three tables. \"For each owner\" means GROUP BY.",
        clues: [
          "Owner names are in owners, costs are in visits → follow the chain owners → pets → visits with two JOINs",
          "\"For each owner\" → GROUP BY owners.owner_id",
          "\"How many visits\" → COUNT. \"How much spent\" → SUM(cost)",
          "\"Biggest spender first\" → ORDER BY total_spent DESC"
        ],
        terms: [["two JOINs", "follow a chain of links across three tables"], ["GROUP BY the ID", "safer than the name, since two owners could share a name"]],
        talk: T`
          We're being asked who our best clients are: visits and total spending for each owner. So here's what we do: join owners to pets to visits, group by owner, count the visits and add up the cost. And here's why: it's a real business question, and it needs all three tables.

          How do we know to join three tables? Owner names live in owners, and costs live in visits. They don't connect directly. They connect through pets. So we follow the chain: owners, JOIN pets on owner_id, then JOIN visits on pet_id.

          How do we know to use GROUP BY? "For each owner." Same signal as the sales project. We group by owner_id rather than the name, because two different owners could share a name.

          Then "how many" is COUNT, and "how much" is SUM. Sort it, and Maya is on top, with four visits across her two pets. We could never get that answer from one table alone.
        `
      },
      {
        ask: "We're being asked to find the pet that has never had a visit.",
        know: "Questions like \"who never…\" or \"which have no…\" need a LEFT JOIN, then WHERE ... IS NULL.",
        clues: [
          "\"Never had a visit\" → we're looking for something missing",
          "A normal JOIN drops pets with no visits, so we'd never see them → LEFT JOIN keeps every pet",
          "No matching visit → the visit columns come back NULL → WHERE visits.visit_id IS NULL",
          "Use IS NULL, not = NULL"
        ],
        terms: [["LEFT JOIN", "keep every row from the first table, even with no match"], ["NULL", "SQL's word for empty"], ["IS NULL", "checks for empty"]],
        talk: T`
          We're being asked to find the pet that has never come in. So here's what we do: a LEFT JOIN from pets to visits, then keep only the pets where no visit was found. And here's why: finding what's missing is just as useful as finding what's there.

          How do we know to use LEFT JOIN? Think about what a normal JOIN does. It only keeps rows that match. A pet with no visits has nothing to match, so it would just disappear, and we'd never find it. LEFT JOIN keeps every row from the first table, pets, even when there's no matching visit.

          When there's no match, the visit columns come back empty. In SQL, empty is called NULL. So we filter with WHERE visits.visit_id IS NULL. Note it's IS NULL, not equals NULL. That's a special rule in SQL.

          And there's Rex. Whenever a question says "who never" or "which have no," like customers who never ordered, this is the pattern.
        `
      }
    ]
  };

  (window.PROJECTS || []).forEach(p => {
    const list = TALK[p.id];
    if (!list) return;
    p.steps.forEach((s, i) => { if (list[i]) Object.assign(s, list[i]); });
  });
})();
