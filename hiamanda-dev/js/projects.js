/* =====================================================================
   HiAmanda.dev — project lessons
   Each project has:
     briefing  -> the mission card + the Instructor View "before you start"
     steps     -> one quest card each, with code, talk track and a check
     wrapUp    -> the Instructor View closing talk track
   `check` is Python that runs after the learner's code. It can use:
     ns (the learner's variables), out (printed text), src (their code),
     need(), fail(), read_text(), exists()
     and for SQL projects: conn, results, expect_query(), table_columns(),
     foreign_keys(), row_count()
   ===================================================================== */
(function () {
  function dedent(text) {
    const lines = text.replace(/\t/g, "    ").split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    const indents = lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length);
    const min = indents.length ? Math.min(...indents) : 0;
    return lines.map(l => l.slice(min)).join("\n");
  }
  const C = (s, ...v) => dedent(String.raw(s, ...v));

  window.PROJECTS = [
    /* ---------------------------------------------------------------
       1. CLEAN A MESSY CSV
       --------------------------------------------------------------- */
    {
      id: "clean-csv",
      title: "Clean a Messy CSV",
      lang: "python",
      file: "cleaning.py",
      files: ["customers_messy.csv"],
      needsPandas: true,
      difficulty: "Beginner",
      minutes: 25,
      skills: ["Python", "pandas", "Fixing data"],
      tagline: "Turn a chaotic spreadsheet into clean, usable data.",
      art: "grid",
      starter: C`
        # Clean a Messy CSV
        # Goal: turn customers_messy.csv into a clean file we can trust.
        # Follow the quest card. Add each step's code below this line.

      `,
      briefing: {
        mission: "A small online shop exported its customer list, and it's a mess: random capital letters, blank rows, money stored as text, and dates in three formats. Your job is to clean it so the team can use it.",
        jobUse: [
          "Analysts, marketers and operations teams clean exported data like this every week",
          "Clean data is what makes reports, dashboards and email lists accurate",
          "Writing it as a script means next month's export takes seconds, not hours"
        ],
        talk: C`
          Today we're going to take a really messy spreadsheet and clean it up using Python. If you've never written code before, that's perfect. I'll explain every line as we go.

          Here's why this matters for a real job. Almost every company exports data from somewhere: a website, a sign-up form, a sales system. And that data almost never comes out clean. Names have random capital letters, there are blank rows, money gets saved as text. If you're an analyst, a marketing coordinator or an operations person, cleaning this kind of file is a huge part of the work.

          You could fix it by hand in Excel. But when we write it as a Python script, next month's file gets cleaned in seconds, exactly the same way, every time. That's the skill employers are looking for.

          Our file is called customers_messy.csv. Let's open it up and see what we're dealing with.
        `
      },
      steps: [
        {
          title: "Open the messy file",
          task: "Load customers_messy.csv into Python and print the first few rows.",
          why: "You can't fix data you haven't looked at. Every cleaning job starts with a peek.",
          doing: ["Bringing in pandas, Python's spreadsheet tool", "Loading the CSV into a variable called df", "Printing the first five rows"],
          whyList: ["Python needs the data loaded before it can change it", "Looking first shows us exactly what's broken"],
          code: C`
            import pandas as pd

            df = pd.read_csv("customers_messy.csv")
            print(df.head())
          `,
          talk: C`
            First, we bring in a tool called pandas. Think of it as Excel, but inside Python. The "as pd" part gives it a short nickname so we don't have to type pandas every time.

            Next, pd.read_csv reads our file, and we store it in something called df. df is a variable, which is just a labeled box that holds something. Here it holds our whole table. People call it df because it's short for DataFrame, which is pandas' word for a table.

            Last, df.head() grabs the first five rows, and print shows them to us. Let's run it.
          `,
          see: "The first five rows. Point out names in ALL CAPS and lowercase, emails with extra spaces, three different date styles, and money with dollar signs.",
          nudge: "Start with import pandas as pd. Then use pd.read_csv(\"customers_messy.csv\") and store the result in df.",
          success: "File loaded. Now you can see the mess you're about to fix.",
          check: C`
            need("pd", "Start with import pandas as pd so Python can use the pandas tool.")
            need("df", "I can't find a variable called df. Load the file into it: df = pd.read_csv('customers_messy.csv')")
            if not isinstance(ns["df"], pd.DataFrame):
                fail("df exists, but it isn't a table. Use pd.read_csv(...) to load the file into it.")
            if "head" not in src:
                fail("Your file loaded. Now preview it with print(df.head()) so you can see the first rows.")
            if not out.strip():
                fail("Nothing printed yet. Put df.head() inside print( ) so the preview shows up.")
          `
        },
        {
          title: "Size up the mess",
          task: "Print how big the table is, then count the blank cells in each column.",
          why: "Numbers beat guessing. Now you know exactly how many problems there are.",
          doing: ["Printing the table's size: rows and columns", "Counting the blank cells in every column"],
          whyList: ["Gives us a 'before' number to compare against later", "Shows which columns have missing data"],
          code: C`
            print(df.shape)
            print(df.isna().sum())
          `,
          talk: C`
            Now let's measure the mess. df.shape tells us the size of the table: how many rows, then how many columns. We get 29 rows and 6 columns.

            The next line is three small instructions chained together. isna means "is this cell empty?" and it checks every cell. Then sum adds them up for each column. So this line counts the blank cells in every column.

            Notice we have blanks in every column, and the email column has more than the others. Keep that in mind, because we'll deal with both.
          `,
          see: "(29, 6), then a list of columns with blank counts. EMAIL has 6 blanks, every other column has 3.",
          nudge: "df.shape gives the size. df.isna().sum() counts blanks. Wrap each one in print( ).",
          success: "29 rows, 6 columns, and you know where the blanks are.",
          check: C`
            if "shape" not in src:
                fail("Add print(df.shape) to see how many rows and columns the table has.")
            if "isna" not in src:
                fail("Add print(df.isna().sum()) to count the blank cells in each column.")
            if "(29, 6)" not in out:
                fail("I don't see the table size in the output. Make sure df.shape is inside print( ), before any cleaning code.")
          `
        },
        {
          title: "Tidy the column names",
          task: "Make every column name lowercase, with no extra spaces, and underscores between words.",
          why: "Messy names like ' Customer ID' cause typos all day. Clean names are easy to type and hard to get wrong.",
          doing: ["Removing spaces around each column name", "Making them lowercase", "Swapping the spaces between words for underscores"],
          whyList: ["Column names with hidden spaces cause confusing errors", "One consistent style makes every later step easier"],
          code: C`
            df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
            print(df.columns.tolist())
          `,
          talk: C`
            Look at our column names. " Customer ID" starts with a sneaky space. "Name" has one at the end. "EMAIL" is shouting. If we tried to use these as they are, we'd get errors that are really hard to spot.

            So we clean the names themselves. df.columns is the list of column names. .str lets us do text operations on all of them at once. strip removes spaces from the start and end, lower makes everything lowercase, and replace swaps the spaces between words for underscores.

            Then we save the result back into df.columns. That equals sign means "store this here." If we left it off, Python would do the work and then throw it away.
          `,
          see: "['customer_id', 'name', 'email', 'signup_date', 'city', 'total_spent']",
          nudge: "Chain three text tools on df.columns: .str.strip(), .str.lower() and .str.replace(\" \", \"_\"). Save the result back into df.columns.",
          success: "Clean, consistent column names. Much easier to work with.",
          check: C`
            cols = list(ns["df"].columns)
            want = ["customer_id", "name", "email", "signup_date", "city", "total_spent"]
            if cols != want:
                if any(c != c.strip() for c in cols):
                    fail("Some names still have spaces at the start or end. Add .str.strip()")
                if any(c != c.lower() for c in cols):
                    fail("Some names still have capital letters. Add .str.lower()")
                if any(" " in c for c in cols):
                    fail("Some names still have spaces between words. Add .str.replace(' ', '_')")
                fail("The column names aren't quite right yet. Make sure you saved the result with df.columns = ...")
          `
        },
        {
          title: "Remove the empty rows",
          task: "Drop rows where every cell is blank, then turn the customer IDs back into whole numbers.",
          why: "Empty rows add nothing and throw off your counts.",
          doing: ["Dropping rows that are completely blank", "Turning IDs like 1001.0 back into 1001", "Printing how many rows are left"],
          whyList: ["Blank rows make totals and counts wrong", "IDs should be whole numbers, not decimals"],
          code: C`
            df = df.dropna(how="all")
            df["customer_id"] = df["customer_id"].astype(int)
            print(len(df), "rows left")
          `,
          talk: C`
            Our file has three rows that are completely empty. dropna means "drop the blanks." Here's the important part: how="all" means only drop a row if all of its cells are blank.

            Why does that matter? Some real customers are missing an email. Without how="all", pandas would delete those customers too, and we'd lose real people. Small details like this are exactly what separates careful data work from sloppy data work.

            Next, the IDs. Because the blank rows were there, pandas stored the IDs as decimals, like 1001.0. Now that the blanks are gone, astype(int) turns them back into whole numbers.

            Last, len counts the rows. We should have 26 real customers.
          `,
          see: "26 rows left",
          nudge: "Use df = df.dropna(how=\"all\"). Don't forget the df = at the start, or the change won't be kept.",
          success: "26 real customers, zero empty rows.",
          check: C`
            d = ns["df"]
            if d.isna().all(axis=1).any():
                fail("There are still completely empty rows. Use df = df.dropna(how='all'), and keep the df = at the start so the change is saved.")
            if len(d) != 26:
                fail(f"You have {len(d)} rows, but there should be 26 customers. how='all' only removes rows where every cell is blank. Without it, dropna also deletes customers who are only missing an email.")
            if "customer_id" in d.columns and not pd.api.types.is_integer_dtype(d["customer_id"]):
                fail("The customer IDs still look like 1001.0. Convert them with df['customer_id'] = df['customer_id'].astype(int)")
          `
        },
        {
          title: "Clean up the text",
          task: "Fix the spacing and capitals in the name, city and email columns.",
          why: "To a computer, 'memphis' and 'MEMPHIS ' are different cities. Consistent text makes grouping and matching work.",
          doing: ["Trimming spaces and using Title Case for names and cities", "Making emails lowercase with no spaces", "Previewing the three columns"],
          whyList: ["Messy text splits one city into several in reports", "Emails are matched exactly, so one stray space breaks them"],
          code: C`
            df["name"] = df["name"].str.strip().str.title()
            df["city"] = df["city"].str.strip().str.title()
            df["email"] = df["email"].str.strip().str.lower()
            print(df[["name", "city", "email"]].head())
          `,
          talk: C`
            Now the names, cities and emails. To us, "memphis" and "MEMPHIS" are the same place. To a computer, they're completely different. If we built a report by city right now, Memphis would show up three times.

            We use the same strip tool to remove spaces. Then title gives us Title Case, where each word starts with a capital letter. For emails, we use lower, since emails are usually stored all lowercase.

            Each line follows the same pattern: grab a column, clean it, and save it back into the same column.

            The last line uses double square brackets. That's how we pick several columns at once to preview.
          `,
          see: "Names like 'Maya Robinson', cities like 'Memphis', and lowercase emails. The blank emails still show NaN, which is pandas' word for empty. We'll handle those soon.",
          nudge: "Same pattern three times: df[\"name\"] = df[\"name\"].str.strip().str.title(). Use .str.lower() for email instead of title.",
          success: "Names, cities and emails are all consistent now.",
          check: C`
            d = ns["df"]
            for col, fix in [("name", "title"), ("city", "title")]:
                bad = [v for v in d[col].dropna() if v != v.strip().title()]
                if bad:
                    fail(f"The {col} column still has messy values, like '{bad[0]}'. Use .str.strip().str.title() and save it back into df['{col}'].")
            bad = [v for v in d["email"].dropna() if v != v.strip().lower()]
            if bad:
                fail(f"The email column still has messy values, like '{bad[0]}'. Use .str.strip().str.lower()")
          `
        },
        {
          title: "Fix the money column",
          task: "Remove the $ and commas from total_spent and turn it into real numbers.",
          why: "Money stored as text can't be added up. Real numbers can be totaled, averaged and charted.",
          doing: ["Removing dollar signs and commas", "Converting the text into decimal numbers", "Adding it all up to prove it works"],
          whyList: ["You can't do math with '$1,026.89', only with 1026.89", "This is one of the most common fixes in real exports"],
          code: C`
            df["total_spent"] = df["total_spent"].str.replace("$", "", regex=False).str.replace(",", "", regex=False)
            df["total_spent"] = df["total_spent"].astype(float)
            print("Total revenue:", df["total_spent"].sum())
          `,
          talk: C`
            Look at the money column. Some values have dollar signs, some have commas, some have neither. Right now, Python sees these as text, the same as a word. You can't add up words.

            So first, we replace the dollar sign with nothing, which removes it. Then we do the same with the commas. regex=False just tells pandas to treat the dollar sign as a normal character.

            Then astype(float) converts the text into numbers. Float is Python's word for a number with a decimal point.

            Now that they're real numbers, we can add them up with sum. That's our total revenue.
          `,
          see: "Total revenue: 31426.79. If you get 'could not convert string to float', a $ or comma is still in there.",
          nudge: "Use .str.replace(\"$\", \"\", regex=False) and .str.replace(\",\", \"\", regex=False). Then convert with .astype(float).",
          success: "The money is real numbers now, so you can add it up.",
          check: C`
            s = ns["df"]["total_spent"]
            if not pd.api.types.is_float_dtype(s):
                fail("total_spent is still text. After removing the $ and commas, convert it with .astype(float)")
            if s.isna().any():
                fail("Some money values turned into blanks. Make sure you only remove '$' and ',' characters.")
            if not (31000 < s.sum() < 34000):
                fail("The total doesn't look right. Check that you removed the $ and the commas before converting.")
          `
        },
        {
          title: "Fix the dates",
          task: "Convert signup_date into real dates, even though it's written three different ways.",
          why: "Real dates can be sorted, filtered by month and compared. Text dates can't.",
          doing: ["Reading three date styles into one real date type", "Previewing the result"],
          whyList: ["Reports often ask 'how many signed up this month?'", "Real dates sort correctly. Text dates sort alphabetically."],
          code: C`
            df["signup_date"] = pd.to_datetime(df["signup_date"], format="mixed")
            print(df["signup_date"].head())
          `,
          talk: C`
            Our dates are written three ways: 2024-01-10, 01/20/2024, and January 26 2024. Humans can read all of those. But to Python they're just text, so we can't sort them or ask how many people signed up in March.

            pd.to_datetime converts text into real dates. format="mixed" tells pandas "these aren't all written the same way, figure out each one."

            When we print it, every date shows in the same year-month-day style. That's pandas showing us it understands them as real dates now.
          `,
          see: "Dates all in the 2024-01-10 style, and a line at the bottom saying dtype: datetime64.",
          nudge: "Use pd.to_datetime(df[\"signup_date\"], format=\"mixed\") and save it back into df[\"signup_date\"].",
          success: "Three date styles, one clean format.",
          check: C`
            s = ns["df"]["signup_date"]
            if not pd.api.types.is_datetime64_any_dtype(s):
                fail("signup_date is still text. Convert it with pd.to_datetime(df['signup_date'], format='mixed') and save it back into the column.")
            if s.isna().any():
                fail("Some dates turned into blanks. Make sure you used format='mixed'.")
          `
        },
        {
          title: "Handle the missing emails",
          task: "Fill the blank emails with the words \"not provided\".",
          why: "A clear label is better than a blank. Everyone who opens the file knows the email is missing on purpose, not by mistake.",
          doing: ["Filling blank emails with 'not provided'", "Recounting the blanks to confirm there are none left"],
          whyList: ["Blanks can break tools that import the file later", "A label makes the gap obvious to anyone reading it"],
          code: C`
            df["email"] = df["email"].fillna("not provided")
            print(df.isna().sum())
          `,
          talk: C`
            Three customers never gave us an email. We have a choice to make. We could delete them, but they're real customers who spent real money. So instead, we'll fill in the blank with a clear label.

            fillna means "fill the blanks." Whatever we put inside the parentheses goes into every empty cell in that column.

            Then we run the same blank-counter from earlier. This time, every column should say zero. That's our proof the data is complete.
          `,
          see: "Every column shows 0 blanks.",
          nudge: "df[\"email\"] = df[\"email\"].fillna(\"not provided\")",
          success: "Zero blanks left anywhere in the table.",
          check: C`
            e = ns["df"]["email"]
            if e.isna().any():
                fail("There are still blank emails. Use df['email'] = df['email'].fillna('not provided')")
            if (e == "not provided").sum() != 3:
                fail("I expected exactly 3 emails to say 'not provided'. Check the spelling inside fillna( ).")
          `
        },
        {
          title: "Save the clean file",
          task: "Save your clean table as customers_clean.csv.",
          why: "Cleaning only counts if you save it. This is the file you'd hand to your team.",
          doing: ["Writing the clean table to a new CSV file", "Printing a confirmation"],
          whyList: ["Never overwrite the original. Keep it as a backup.", "The clean file is ready for reports or importing"],
          code: C`
            df.to_csv("customers_clean.csv", index=False)
            print("Saved", len(df), "clean customers!")
          `,
          talk: C`
            Last step: save our work. to_csv writes the table out to a new file. Notice we give it a new name, customers_clean.csv. We never overwrite the original. If something ever goes wrong, we still have the raw file to start over from.

            index=False tells pandas not to add an extra column of row numbers. Without it, you'd get a mystery column at the front of your file.

            Run it, and watch the new file appear on the left. That's a clean dataset, built by a script you can reuse any time.
          `,
          see: "Saved 26 clean customers!, and customers_clean.csv appears in the file list. Click it to show the clean data on camera.",
          nudge: "df.to_csv(\"customers_clean.csv\", index=False)",
          success: "customers_clean.csv is saved and ready to share.",
          check: C`
            if not exists("customers_clean.csv"):
                fail("I can't find customers_clean.csv. Use df.to_csv('customers_clean.csv', index=False). Check the file name spelling.")
            saved = pd.read_csv("customers_clean.csv")
            if any(str(c).startswith("Unnamed") for c in saved.columns):
                fail("Your file has an extra column of row numbers. Add index=False inside to_csv( ).")
            if len(saved) != 26:
                fail(f"The saved file has {len(saved)} rows, but it should have 26. Make sure to_csv comes after all your cleaning steps.")
          `
        }
      ],
      recap: ["Load a CSV file with pandas", "Measure blanks and messy values", "Rename columns consistently", "Remove empty rows safely", "Clean text, money and dates", "Save a clean copy of your data"],
      wrapUp: C`
        And that's it. We took a file with blank rows, messy names, money stored as text and dates in three different styles, and turned it into clean data.

        Here's the best part. This whole script is reusable. When next month's export shows up just as messy, you run this file and it's done in about a second. That's the difference between someone who cleans data by hand and someone who automates it.

        If you want to practice, try adding one more step on your own. Maybe sort the customers by how much they spent, using df.sort_values. I'll see you in the next project.
      `
    },

    /* ---------------------------------------------------------------
       2. ANALYZE A SALES DATABASE
       --------------------------------------------------------------- */
    {
      id: "sales-sql",
      title: "Analyze a Sales Database",
      lang: "sql",
      file: "analysis.sql",
      files: ["sales.db"],
      db: { name: "sales.db", seed: "sales_seed.sql", fresh: false },
      difficulty: "Beginner",
      minutes: 30,
      skills: ["SQL", "SELECT", "WHERE", "GROUP BY"],
      tagline: "Answer real business questions with SQL.",
      art: "bars",
      starter: C`
        -- Analyze a Sales Database
        -- Goal: answer the questions a manager would ask about six months of sales.
        -- Write each query below. End every query with a semicolon ;

      `,
      briefing: {
        mission: "Brew & Bean, a small coffee company, sells online. Their sales from January to June are in a database. The owner has questions, and you'll answer each one with SQL.",
        jobUse: [
          "SQL is listed in a huge share of analyst, operations and marketing job posts",
          "Managers ask 'what sold best?' and 'which region is growing?' constantly",
          "These same queries work on the databases behind real company tools"
        ],
        talk: C`
          In this project, we're going to learn SQL, which is how people ask questions of a database. SQL stands for Structured Query Language. You'll hear people say it "sequel" or "S-Q-L", and both are fine.

          Here's why it matters. Almost every company keeps its data in a database: sales, customers, orders. And when the boss asks "what was our best-selling product last quarter?", someone has to go get the answer. That someone writes SQL. It shows up in job posts for data analysts, operations, marketing, finance and more.

          Our data comes from a small coffee company called Brew & Bean. We have six months of online orders in a database file called sales.db. It has one table called sales. Think of a table like a single spreadsheet tab, with rows and columns.

          We'll answer questions a manager would actually ask, one query at a time.
        `
      },
      steps: [
        {
          title: "Peek at the table",
          task: "Show the first 10 rows of the sales table.",
          why: "Before you analyze anything, you need to know what columns exist and what the data looks like.",
          doing: ["Selecting every column from the sales table", "Limiting it to 10 rows so it's easy to read"],
          whyList: ["Shows the column names you'll use in every query", "LIMIT keeps big tables from flooding your screen"],
          code: C`
            SELECT * FROM sales LIMIT 10;
          `,
          talk: C`
            Our very first query. Read it out loud like a sentence: select everything from sales, limit 10.

            SELECT means "show me." The star means "every column." FROM sales says which table to look in. And LIMIT 10 says just show me the first 10 rows. Real databases can have millions of rows, so LIMIT is a good habit.

            The semicolon at the end is like a period. It tells the database "this question is finished."

            SQL keywords are usually written in capitals. That's not required, but it makes the commands easy to spot.
          `,
          see: "A table with 10 orders and 8 columns: order_id, order_date, customer, region, product, category, quantity and unit_price.",
          nudge: "SELECT * means every column. Add FROM sales, then LIMIT 10, then a semicolon.",
          success: "Now you know every column in the sales table.",
          check: C`
            expect_query("SELECT * FROM sales LIMIT 10", ordered=True)
          `
        },
        {
          title: "Filter to one region",
          task: "Show the order date, product and quantity for every order from the South region.",
          why: "Managers rarely want everything. Filtering answers 'what about just this part?'",
          doing: ["Picking only three columns", "Keeping only rows where region is South"],
          whyList: ["Choosing columns keeps results focused", "WHERE is how you filter, the same idea as a filter in Excel"],
          code: C`
            SELECT order_date, product, quantity
            FROM sales
            WHERE region = 'South';
          `,
          talk: C`
            Now let's get specific. Instead of a star, we list the exact columns we want: order date, product and quantity, separated by commas.

            Then comes the new part, WHERE. WHERE is a filter. It keeps only the rows that match. Here we're saying: only show orders where region equals South.

            Notice South is in single quotes. In SQL, text values go in quotes. And capitalization matters inside the quotes, so 'south' with a lowercase s would find nothing.

            Also notice we split the query across three lines. SQL doesn't care about line breaks. It only stops at the semicolon. Splitting it up just makes it easier to read.
          `,
          see: "Only South orders, with three columns: order_date, product and quantity.",
          nudge: "List the three columns after SELECT, then FROM sales, then WHERE region = 'South'. Text goes in single quotes.",
          success: "Filtered. That's exactly how you answer 'what about just the South?'",
          check: C`
            expect_query("SELECT order_date, product, quantity FROM sales WHERE region = 'South'", ordered=False)
          `
        },
        {
          title: "Find the biggest orders",
          task: "Show the 5 orders with the largest quantity, biggest first.",
          why: "'What were our biggest orders?' is one of the most common questions a manager asks.",
          doing: ["Sorting all orders by quantity", "Biggest first, using DESC", "Keeping just the top 5"],
          whyList: ["ORDER BY sorts results", "Top-5 lists show up in almost every report"],
          code: C`
            SELECT order_date, product, quantity
            FROM sales
            ORDER BY quantity DESC
            LIMIT 5;
          `,
          talk: C`
            Next question: what were our biggest orders? To answer it, we need to sort.

            ORDER BY quantity sorts the rows by the quantity column. By default it goes smallest to biggest. Adding DESC, short for descending, flips it so the biggest come first.

            Then LIMIT 5 keeps the top five. Put those together, and you've got a top-five list.

            The order of these words matters. It's always SELECT, then FROM, then WHERE if you have one, then ORDER BY, then LIMIT.
          `,
          see: "Five rows, starting with a Travel Tumbler order of 40.",
          nudge: "Add ORDER BY quantity DESC, then LIMIT 5. DESC means biggest first.",
          success: "Top five orders, biggest first.",
          check: C`
            expect_query("SELECT order_date, product, quantity FROM sales ORDER BY quantity DESC LIMIT 5", ordered=True)
          `
        },
        {
          title: "Calculate revenue",
          task: "For each order, multiply quantity by unit price and call it revenue. Show the top 5.",
          why: "A big quantity of cheap items isn't always a big sale. Revenue is what the business actually cares about.",
          doing: ["Multiplying two columns to make a new one", "Naming the new column revenue with AS", "Sorting by revenue, top 5"],
          whyList: ["SQL can calculate as it reads", "AS gives your result a clear name for reports"],
          code: C`
            SELECT product, quantity * unit_price AS revenue
            FROM sales
            ORDER BY revenue DESC
            LIMIT 5;
          `,
          talk: C`
            Quantity doesn't tell the whole story. Selling 40 cheap mugs might bring in less money than 10 expensive ones. What we really care about is revenue: quantity times price.

            SQL can do math right inside the query. quantity star unit_price multiplies the two columns for every row. In code, the star means multiply.

            Then AS revenue gives that new column a name. Without AS, the column would be called "quantity * unit_price", which is ugly in a report. Now we can also sort by our new revenue column.
          `,
          see: "Five rows with product and revenue, starting with Travel Tumbler at 960.0.",
          nudge: "In the SELECT, write quantity * unit_price AS revenue. Then ORDER BY revenue DESC LIMIT 5.",
          success: "You created a brand new column with math.",
          check: C`
            expect_query("SELECT product, quantity * unit_price AS revenue FROM sales ORDER BY revenue DESC LIMIT 5", ordered=True, names=["product", "revenue"])
          `
        },
        {
          title: "Get the big totals",
          task: "Count all orders and add up total revenue in one query.",
          why: "These are the headline numbers. Every report starts with 'how many and how much'.",
          doing: ["Counting every row with COUNT", "Adding up revenue with SUM", "Getting one row of totals back"],
          whyList: ["COUNT and SUM are the two functions you'll use most", "Summary numbers turn rows into answers"],
          code: C`
            SELECT
              COUNT(*) AS total_orders,
              SUM(quantity * unit_price) AS total_revenue
            FROM sales;
          `,
          talk: C`
            Now the headline numbers. How many orders did we get, and how much money did they bring in?

            COUNT star counts every row. Since every row is one order, that's our total number of orders.

            SUM adds things up. We sum the same revenue math from the last step, quantity times unit price, across every order.

            Notice we get back just one row. These are called aggregate functions. They squash many rows into one answer.
          `,
          see: "One row: 150 total orders and the total revenue.",
          nudge: "COUNT(*) counts rows. SUM(quantity * unit_price) adds up revenue. Name them total_orders and total_revenue with AS.",
          success: "Headline numbers, done. Every report starts here.",
          check: C`
            expect_query("SELECT COUNT(*) AS total_orders, SUM(quantity * unit_price) AS total_revenue FROM sales", ordered=True, names=["total_orders", "total_revenue"])
          `
        },
        {
          title: "Revenue by region",
          task: "Show total revenue for each region, highest first.",
          why: "'Which region is doing best?' is a classic manager question. GROUP BY answers it.",
          doing: ["Grouping orders by region", "Summing revenue inside each group", "Sorting the regions by revenue"],
          whyList: ["GROUP BY is the same idea as a pivot table", "It turns one big total into a breakdown"],
          code: C`
            SELECT region, SUM(quantity * unit_price) AS revenue
            FROM sales
            GROUP BY region
            ORDER BY revenue DESC;
          `,
          talk: C`
            This is the big one. GROUP BY is the most useful thing in SQL, and if you've ever used a pivot table in Excel, you already know the idea.

            GROUP BY region puts all the orders into piles, one pile per region: North, South, East and West. Then SUM adds up the revenue inside each pile separately.

            So instead of one total for everything, we get one total per region. Then we sort, so the best region is on top.
          `,
          see: "Four rows, one per region, with the highest revenue first.",
          nudge: "SELECT region and SUM(quantity * unit_price) AS revenue. Then GROUP BY region and ORDER BY revenue DESC.",
          success: "You just built a pivot table with one query.",
          check: C`
            expect_query("SELECT region, SUM(quantity * unit_price) AS revenue FROM sales GROUP BY region ORDER BY revenue DESC", ordered=True, names=["region", "revenue"])
          `
        },
        {
          title: "Best-selling category",
          task: "For each category, show units sold and revenue rounded to 2 decimals, highest revenue first.",
          why: "This tells the owner where to focus: what to restock, promote or drop.",
          doing: ["Grouping by category", "Adding up units and revenue", "Rounding money to two decimal places"],
          whyList: ["You can calculate several totals per group at once", "ROUND keeps money looking like money"],
          code: C`
            SELECT
              category,
              SUM(quantity) AS units_sold,
              ROUND(SUM(quantity * unit_price), 2) AS revenue
            FROM sales
            GROUP BY category
            ORDER BY revenue DESC;
          `,
          talk: C`
            Same idea, new question: which category makes the most money, Coffee, Tea, Bakery or Merch?

            This time we calculate two things per group. SUM of quantity gives us how many units sold, and the revenue math gives us money.

            We also wrap the revenue in ROUND, with a 2. That rounds it to two decimal places, like real money.

            Here's something interesting to point out: the category that sells the most units isn't always the one that makes the most money. That's exactly the kind of insight a manager wants.
          `,
          see: "Four rows, one per category, with units_sold and revenue.",
          nudge: "Group by category. Use SUM(quantity) AS units_sold and ROUND(SUM(quantity * unit_price), 2) AS revenue.",
          success: "Now the owner knows exactly what's selling.",
          check: C`
            expect_query("SELECT category, SUM(quantity) AS units_sold, ROUND(SUM(quantity * unit_price), 2) AS revenue FROM sales GROUP BY category ORDER BY revenue DESC", ordered=True, names=["category", "units_sold", "revenue"])
          `
        },
        {
          title: "Monthly trend",
          task: "Show total revenue for each month, in order from January to June.",
          why: "'Are we growing?' Monthly totals answer it, and they're what you'd put in a chart.",
          doing: ["Turning each date into its year and month", "Grouping by month", "Sorting from January to June"],
          whyList: ["Trends over time are in almost every business report", "This output is exactly what you'd turn into a line chart"],
          code: C`
            SELECT
              strftime('%Y-%m', order_date) AS month,
              ROUND(SUM(quantity * unit_price), 2) AS revenue
            FROM sales
            GROUP BY month
            ORDER BY month;
          `,
          talk: C`
            Last question, and it's one every owner asks: are we growing?

            Our dates look like 2025-03-14. To group by month, we need just the year and month part, 2025-03. strftime is a date tool. The '%Y-%m' part is a pattern that means "give me the year, a dash, then the month."

            Then we group by that month and add up the revenue, just like before. And we sort by month so it reads January through June, in order.

            This is exactly the table you'd hand to someone to make a line chart. Six rows that tell the story of the business.
          `,
          see: "Six rows, 2025-01 through 2025-06, each with a revenue total.",
          nudge: "Use strftime('%Y-%m', order_date) AS month. Then GROUP BY month and ORDER BY month.",
          success: "Six months of trend data, ready for a chart.",
          check: C`
            expect_query("SELECT strftime('%Y-%m', order_date) AS month, ROUND(SUM(quantity * unit_price), 2) AS revenue FROM sales GROUP BY month ORDER BY month", ordered=True, names=["month", "revenue"])
          `
        }
      ],
      recap: ["Read data with SELECT and FROM", "Filter rows with WHERE", "Sort and rank with ORDER BY and LIMIT", "Calculate new columns with AS", "Summarize with COUNT, SUM and ROUND", "Break totals down with GROUP BY", "Group dates by month"],
      wrapUp: C`
        Look at what we just did. We answered eight real business questions: what's in the data, what's happening in one region, our biggest orders, our total revenue, the best region, the best category, and how sales changed month to month.

        Every one of those is a question a real manager asks. And now you can answer them in a few lines of SQL.

        If you want to keep practicing, try asking your own question. Who's our best customer? Try grouping by the customer column. I'll see you in the next one.
      `
    },

    /* ---------------------------------------------------------------
       3. PULL DATA FROM AN API
       --------------------------------------------------------------- */
    {
      id: "weather-api",
      title: "Pull Data from an API",
      lang: "python",
      file: "weather_report.py",
      files: ["cities.csv"],
      difficulty: "Intermediate",
      minutes: 25,
      skills: ["Python", "APIs", "JSON", "requests"],
      tagline: "Pull live weather data and turn it into a report.",
      art: "orbit",
      starter: C`
        # Pull Data from an API
        # Goal: get live weather for six cities and save it as a report.
        # Follow the quest card. Add each step's code below this line.

      `,
      briefing: {
        mission: "Your team wants a daily weather snapshot for six cities. Instead of checking a website six times, you'll write a script that asks a free weather service for the data and saves a report.",
        jobUse: [
          "Companies pull data from APIs all day: payments, shipping, weather, social media",
          "Automating a daily lookup saves hours every week",
          "Reading JSON is a core skill for data, automation and developer roles"
        ],
        talk: C`
          In this project, we're going to get our code to talk to another computer on the internet and bring back live data. That's called using an API.

          API stands for Application Programming Interface, but here's the simple version. A website is made for people to look at. An API is made for programs to ask questions. You send a request, like "what's the weather in Chicago?", and it sends back an answer as data.

          This is everywhere in real jobs. Online stores use APIs to check shipping, finance teams pull exchange rates, and marketing teams pull numbers from social media. If you can call an API, you can automate tasks that people do by hand every single day.

          We're using a free weather service called Open-Meteo. It doesn't need a password or a sign-up. Our goal: get the current weather for six cities, find the warmest one, and save it all as a report.
        `
      },
      steps: [
        {
          title: "Make your first request",
          task: "Ask the weather API for New York's current temperature and wind, then print the status code.",
          why: "This is the moment your code talks to another computer. The status code tells you if it worked.",
          doing: ["Importing requests, the tool for calling websites", "Building the address and the details we want", "Sending the request and printing the status code"],
          whyList: ["Every API call has this same shape: address, details, request", "200 means success. Checking it first saves confusion later."],
          code: C`
            import requests

            url = "https://api.open-meteo.com/v1/forecast"
            params = {
                "latitude": 40.71,
                "longitude": -74.01,
                "current": "temperature_2m,wind_speed_10m",
                "temperature_unit": "fahrenheit",
                "wind_speed_unit": "mph",
            }
            response = requests.get(url, params=params)
            print(response.status_code)
          `,
          talk: C`
            First we import requests. It's the most popular Python tool for talking to websites and APIs.

            Next, url is the address of the weather API. Think of it like the phone number we're calling.

            params is our list of details. The curly brackets make what Python calls a dictionary. A dictionary is a list of labels and values, like a form you fill out. We're saying: latitude 40.71 and longitude -74.01, which is New York. We want the current temperature and wind speed, in Fahrenheit and miles per hour.

            requests.get sends the request and stores the answer in response. Then we print the status code. 200 is the internet's way of saying "OK, here's your data." You might have seen 404 before. That one means "not found."
          `,
          see: "200",
          nudge: "Import requests, build the url and params, then response = requests.get(url, params=params). Print response.status_code.",
          success: "Your code just talked to a server on the internet.",
          check: C`
            need("requests", "Start with import requests so Python can call the API.")
            need("response", "I can't find a variable called response. Store the answer: response = requests.get(url, params=params)")
            r = ns["response"]
            if not hasattr(r, "status_code"):
                fail("response doesn't look like an API answer. Use requests.get(url, params=params)")
            if r.status_code != 200:
                fail(f"The API answered with status {r.status_code} instead of 200. Check the url spelling and the params.")
            if "200" not in out:
                fail("It worked, but print the status so you can see it: print(response.status_code)")
          `
        },
        {
          title: "Read the JSON",
          task: "Turn the response into a Python dictionary and print it.",
          why: "APIs send data as JSON. Turning it into Python lets you pick out exactly what you need.",
          doing: ["Converting the response into a Python dictionary", "Printing it to see its shape"],
          whyList: ["JSON is the language almost every API speaks", "You have to see the shape before you can dig into it"],
          code: C`
            data = response.json()
            print(data)
          `,
          talk: C`
            The API sent back its answer in a format called JSON. It's just text, organized with labels and values. Almost every API in the world uses JSON.

            response.json turns that text into a Python dictionary, which we store in data.

            When we print it, look at the shape. There's a section called "current", and inside it are temperature_2m and wind_speed_10m. Those are the numbers we want. It's like folders inside folders, and in the next step we'll open the right folder.
          `,
          see: "A dictionary with latitude, longitude, current_units and current. Point to the current section on camera.",
          nudge: "data = response.json(), then print(data).",
          success: "Now you can see exactly where the numbers live.",
          check: C`
            need("data", "I can't find data. Convert the answer with data = response.json()")
            d = ns["data"]
            if not isinstance(d, dict):
                fail("data should be a dictionary. Use data = response.json(), with the parentheses at the end.")
            if "current" not in d:
                fail("The answer has no current weather. Check that your params include 'current': 'temperature_2m,wind_speed_10m'")
          `
        },
        {
          title: "Pull out the numbers",
          task: "Grab the temperature and wind speed from data and print a friendly sentence.",
          why: "Raw JSON is for computers. A clear sentence is for people.",
          doing: ["Reaching into the current section", "Storing temperature and wind in variables", "Printing a readable sentence with an f-string"],
          whyList: ["Square brackets are how you open each layer of JSON", "f-strings mix text and numbers cleanly"],
          code: C`
            temp = data["current"]["temperature_2m"]
            wind = data["current"]["wind_speed_10m"]
            print(f"New York: {temp}°F, wind {wind} mph")
          `,
          talk: C`
            Now we dig in. data square-bracket "current" opens the current folder. Then square-bracket "temperature_2m" grabs the temperature inside it. We store that in temp. Same thing for wind.

            The print line uses something called an f-string. See the little f before the quotes? That lets us drop variables right into the sentence using curly brackets. So {temp} gets replaced with the actual temperature.

            Now instead of a wall of data, we get one clear sentence a person can read.
          `,
          see: "New York: 52.3°F, wind 8.1 mph (your numbers will be live, so they'll be different).",
          nudge: "temp = data[\"current\"][\"temperature_2m\"]. Do the same for wind with \"wind_speed_10m\". Then print with an f-string.",
          success: "Live data, turned into a sentence people can read.",
          check: C`
            need("temp", "I can't find temp. Grab it with temp = data['current']['temperature_2m']")
            need("wind", "I can't find wind. Grab it with wind = data['current']['wind_speed_10m']")
            if not isinstance(ns["temp"], (int, float)):
                fail("temp should be a number. Make sure you used both sets of square brackets: data['current']['temperature_2m']")
            if "New York" not in out:
                fail("Print a sentence that includes the city, like print(f'New York: {temp}°F, wind {wind} mph')")
          `
        },
        {
          title: "Make it reusable",
          task: "Write a function called get_weather that takes a latitude and longitude and returns the current weather.",
          why: "A function lets you ask for any city with one line, instead of copying the request code six times.",
          doing: ["Wrapping the request in a function", "Adding a safety check with raise_for_status", "Testing it on Chicago"],
          whyList: ["Functions stop you repeating yourself", "raise_for_status stops the script loudly if the API fails, instead of quietly giving bad data"],
          code: C`
            def get_weather(lat, lon):
                params = {
                    "latitude": lat,
                    "longitude": lon,
                    "current": "temperature_2m,wind_speed_10m",
                    "temperature_unit": "fahrenheit",
                    "wind_speed_unit": "mph",
                }
                response = requests.get(url, params=params)
                response.raise_for_status()
                return response.json()["current"]

            print(get_weather(41.88, -87.63))
          `,
          talk: C`
            We want weather for six cities. We could copy and paste our request code six times, but that's messy. If we wanted to change one thing, we'd have to change it in six places.

            Instead, we write a function. def means "define a new function", and we call it get_weather. lat and lon in the parentheses are inputs. Each time we use the function, we hand it a new latitude and longitude.

            Notice the indentation. Everything indented under def belongs to the function. Python uses those spaces to know where the function starts and stops.

            raise_for_status is a safety check. If the API ever sends back an error, the script stops and tells us, instead of quietly carrying on with bad data.

            return hands the current weather back to whoever asked. Then we test it on Chicago.
          `,
          see: "A dictionary for Chicago, with time, interval, temperature_2m and wind_speed_10m.",
          nudge: "Start with def get_weather(lat, lon): and indent the params and request inside it. End with return response.json()[\"current\"].",
          success: "One function, any city. That's how real scripts are built.",
          check: C`
            need("get_weather", "I can't find a function called get_weather. Start it with def get_weather(lat, lon):")
            f = ns["get_weather"]
            if not callable(f):
                fail("get_weather should be a function. Start it with def get_weather(lat, lon):")
            try:
                result = f(41.88, -87.63)
            except TypeError:
                fail("get_weather should take two inputs: def get_weather(lat, lon):")
            if not isinstance(result, dict) or "temperature_2m" not in result:
                fail("get_weather should return the current weather. End it with return response.json()['current']")
            if "raise_for_status" not in src:
                fail("Add response.raise_for_status() inside the function, right after the request. It stops the script if the API fails.")
          `
        },
        {
          title: "Loop through every city",
          task: "Read cities.csv, call get_weather for each city, and collect the results in a list.",
          why: "This is automation: one script does six lookups, and it would do 600 just as easily.",
          doing: ["Opening cities.csv", "Looping through each row", "Collecting city, temperature and wind in a list"],
          whyList: ["Loops are how code repeats work for you", "Collecting results in a list sets up the report"],
          code: C`
            import csv

            results = []
            with open("cities.csv") as f:
                for row in csv.DictReader(f):
                    current = get_weather(row["lat"], row["lon"])
                    results.append({
                        "city": row["city"],
                        "temp_f": current["temperature_2m"],
                        "wind_mph": current["wind_speed_10m"],
                    })
                    print(row["city"], current["temperature_2m"])
          `,
          talk: C`
            Now the fun part, automation. We have a file called cities.csv with six cities and their coordinates. Click it on the left to show it.

            results equals an empty list, those square brackets. It's an empty box we'll fill up as we go.

            with open opens the file. csv.DictReader reads each row as a dictionary, so we can say row["city"] instead of remembering column numbers.

            Then the for loop. "For row in" means: do the indented code once for every row. So for each city, we call our get_weather function, then use append to add a small dictionary to our results list.

            Watch the output. Six cities, six API calls, and we wrote the code once.
          `,
          see: "Six lines, one per city with its temperature.",
          nudge: "Start with results = []. Then with open(\"cities.csv\") as f:, and for row in csv.DictReader(f):. Inside the loop, call get_weather and use results.append({...}).",
          success: "Six API calls from one loop. That's automation.",
          check: C`
            need("results", "I can't find results. Start with an empty list: results = []")
            r = ns["results"]
            if not isinstance(r, list):
                fail("results should be a list. Start with results = []")
            if len(r) != 6:
                fail(f"results has {len(r)} items, but there are 6 cities. Make sure results.append(...) is indented inside the for loop.")
            for item in r:
                if not isinstance(item, dict) or set(item) != {"city", "temp_f", "wind_mph"}:
                    fail("Each item in results should have exactly these keys: 'city', 'temp_f' and 'wind_mph'.")
          `
        },
        {
          title: "Find the warmest city",
          task: "Use max to find the city with the highest temperature and print it.",
          why: "Data is only useful when it answers a question. This one answers 'where's warmest right now?'",
          doing: ["Finding the item with the highest temp_f", "Printing the answer"],
          whyList: ["max can compare by any value you choose", "Turning data into an answer is the whole point"],
          code: C`
            warmest = max(results, key=lambda r: r["temp_f"])
            print(f"Warmest right now: {warmest['city']} at {warmest['temp_f']}°F")
          `,
          talk: C`
            Now let's answer a question with our data: which city is warmest right now?

            max finds the biggest item. But our items are dictionaries, so we have to tell max what to compare. That's what key does.

            The lambda part looks scary, but it's just a tiny one-line function. It says: for each result r, look at its temp_f. So max compares the temperatures and gives back the whole dictionary for the warmest city.

            Then we print the answer in a sentence.
          `,
          see: "Warmest right now: Miami at 79.4°F (live, so it may be a different city).",
          nudge: "warmest = max(results, key=lambda r: r[\"temp_f\"]). Then print warmest['city'].",
          success: "Question asked, question answered.",
          check: C`
            need("warmest", "I can't find warmest. Use warmest = max(results, key=lambda r: r['temp_f'])")
            r = ns["results"]
            top = max(x["temp_f"] for x in r)
            w = ns["warmest"]
            if not isinstance(w, dict) or w.get("temp_f") != top:
                fail("warmest isn't the hottest city. Make sure you used key=lambda r: r['temp_f'] inside max( ).")
            if w["city"] not in out:
                fail("Print the answer so you can see it: print(f\"Warmest right now: {warmest['city']}\")")
          `
        },
        {
          title: "Save the report",
          task: "Write results to weather_report.csv with columns city, temp_f and wind_mph.",
          why: "A saved file can be emailed, opened in Excel or loaded into a dashboard. A printout can't.",
          doing: ["Creating a new CSV file", "Writing the header row", "Writing every city's row"],
          whyList: ["Reports have to live somewhere people can open them", "DictWriter turns your list of dictionaries straight into a table"],
          code: C`
            with open("weather_report.csv", "w", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=["city", "temp_f", "wind_mph"])
                writer.writeheader()
                writer.writerows(results)

            print("Saved weather_report.csv")
          `,
          talk: C`
            Last step: save our report so other people can use it.

            We open a new file, and the "w" means write. newline equals empty quotes just keeps Windows from adding blank lines between rows.

            DictWriter is the partner of DictReader. We tell it our column names with fieldnames. writeheader writes the column names as the first row, and writerows writes every dictionary in our results list as a row.

            Run it, and weather_report.csv shows up on the left. Click it. That's a live data report, built by your script. In a real job, you could schedule this to run every morning automatically.
          `,
          see: "Saved weather_report.csv, and the file appears on the left with 6 cities.",
          nudge: "with open(\"weather_report.csv\", \"w\", newline=\"\") as f:, then csv.DictWriter with fieldnames, writeheader() and writerows(results).",
          success: "A live weather report, saved and ready to share.",
          check: C`
            if not exists("weather_report.csv"):
                fail("I can't find weather_report.csv. Check the file name inside open( ), and that you used 'w' to write.")
            lines = [l for l in read_text("weather_report.csv").splitlines() if l.strip()]
            if not lines or lines[0].strip() != "city,temp_f,wind_mph":
                fail("The first line should be the header: city,temp_f,wind_mph. Did you call writer.writeheader()?")
            if len(lines) != 7:
                fail(f"The file has {len(lines) - 1} data rows, but it should have 6. Use writer.writerows(results).")
          `
        }
      ],
      recap: ["Call an API with requests", "Check a status code", "Read JSON into Python", "Write a reusable function", "Loop over a CSV file", "Find the max of a list", "Save results as a report"],
      wrapUp: C`
        Let's recap what we built. Our script talks to a weather service on the internet, gets live data for six cities, figures out which is warmest, and saves a report. All from about 40 lines of code.

        The pattern we used, request, read the JSON, pull out what you need, loop, and save, is the same pattern for almost every API out there. Swap the weather service for a shipping service, a stock price service or a sports scores service, and the steps are the same.

        Try this to practice: add your own city to cities.csv and run it again. I'll see you in the next project.
      `
    },

    /* ---------------------------------------------------------------
       4. FIND DUPLICATE RECORDS
       --------------------------------------------------------------- */
    {
      id: "duplicates",
      title: "Find Duplicate Records",
      lang: "python",
      file: "find_duplicates.py",
      files: ["signups.csv"],
      difficulty: "Beginner",
      minutes: 20,
      skills: ["Python", "Sets", "Dictionaries", "Matching"],
      tagline: "Catch the double sign-ups hiding in a list.",
      art: "twins",
      starter: C`
        # Find Duplicate Records
        # Goal: find everyone who signed up twice, and make a clean list.
        # Follow the quest card. Add each step's code below this line.

      `,
      briefing: {
        mission: "An events team collected sign-ups for two workshops. Some people submitted the form twice, and some typed their email differently the second time. You'll find every duplicate and build a clean list.",
        jobUse: [
          "Duplicate contacts mean double emails, wrong headcounts and annoyed customers",
          "Cleaning CRM and mailing lists is a common task in marketing and operations",
          "The 'normalize, then match' idea works for any kind of record"
        ],
        talk: C`
          This project solves a problem almost every business has: duplicates.

          Picture this. You run an event, and people sign up through a form. Some people click submit twice. Some sign up again a week later and type their email a little differently, with a capital letter or an extra space. Now your list says 37 people are coming, but really it's fewer. You'd order too much food, send people double emails, and your numbers would be wrong.

          In real jobs, this shows up in customer lists, mailing lists, sales systems and sign-up sheets. Being the person who can clean it up is genuinely valuable.

          We'll use plain Python, no extra tools. You'll learn three building blocks: lists, sets and dictionaries. And you'll learn a trick that pros use: clean the data first, then compare.
        `
      },
      steps: [
        {
          title: "Read the sign-ups",
          task: "Read signups.csv into a list called rows and print how many there are.",
          why: "First, get every sign-up into Python so you can compare them.",
          doing: ["Opening the CSV file", "Reading every row into a list", "Printing the count and the first row"],
          whyList: ["A list holds all the records in order", "Looking at one row shows you what each record contains"],
          code: C`
            import csv

            with open("signups.csv") as f:
                rows = list(csv.DictReader(f))

            print(len(rows), "sign-ups")
            print(rows[0])
          `,
          talk: C`
            We start by bringing in csv, Python's built-in tool for reading spreadsheet files.

            with open opens our file. csv.DictReader reads each row as a dictionary. That means instead of a plain list of values, each row has labels: name, email, phone, event and signup_date.

            Wrapping it in list puts every row into one list called rows.

            Then we print two things. len counts how many rows there are. rows square-bracket zero shows us the first row. Python starts counting at zero, not one. That trips up everyone at first.
          `,
          see: "37 sign-ups, then the first row as a dictionary with name, email, phone, event and signup_date.",
          nudge: "Inside with open(\"signups.csv\") as f:, write rows = list(csv.DictReader(f)). Then print len(rows).",
          success: "37 sign-ups loaded. Now let's see how many are real.",
          check: C`
            need("rows", "I can't find rows. Read the file into it: rows = list(csv.DictReader(f))")
            r = ns["rows"]
            if not isinstance(r, list):
                fail("rows should be a list. Wrap it like this: list(csv.DictReader(f))")
            if len(r) != 37:
                fail(f"rows has {len(r)} items, but the file has 37 sign-ups. Make sure you read signups.csv.")
            if "37" not in out:
                fail("Print the count so you can see it: print(len(rows), 'sign-ups')")
          `
        },
        {
          title: "Catch the exact duplicates",
          task: "Use a set to find rows that are exactly the same as an earlier row.",
          why: "Exact duplicates are the easy ones: someone clicked submit twice.",
          doing: ["Making an empty set to remember rows we've seen", "Checking each row against it", "Collecting the repeats"],
          whyList: ["A set checks 'have I seen this before?' instantly", "This catches double-clicks and copy-paste mistakes"],
          code: C`
            seen = set()
            exact_dupes = []

            for row in rows:
                key = tuple(row.values())
                if key in seen:
                    exact_dupes.append(row)
                else:
                    seen.add(key)

            print(len(exact_dupes), "exact duplicates")
          `,
          talk: C`
            Now we'll find the easy duplicates: rows that are exactly the same, every single value.

            We make two empty containers. seen is a set. A set is like a list, but it's super fast at answering one question: "is this already in here?" exact_dupes is a list where we'll collect the repeats.

            Then we loop through every row. tuple(row.values()) turns the row into one value we can store in the set, kind of like taking a fingerprint of the row.

            Then the if: if we've seen this fingerprint before, it's a duplicate, so we add it to our list. Otherwise, we add the fingerprint to seen, so we'll recognize it next time.
          `,
          see: "4 exact duplicates",
          nudge: "Make seen = set() and exact_dupes = []. In the loop, key = tuple(row.values()). If key in seen, append the row. Otherwise, seen.add(key).",
          success: "4 double-clicks caught. Now for the sneaky ones.",
          check: C`
            need("exact_dupes", "I can't find exact_dupes. Start with exact_dupes = [] before the loop.")
            n = len(ns["exact_dupes"])
            if n != 4:
                fail(f"You found {n} exact duplicates, but there are 4. Check the if/else: add to exact_dupes when key in seen, otherwise seen.add(key).")
          `
        },
        {
          title: "Clean emails before comparing",
          task: "Write a function called clean_email that removes spaces and makes an email lowercase.",
          why: "'Tom.Becker@Example.com ' and 'tom.becker@example.com' are the same person. Cleaning first lets the computer see that.",
          doing: ["Writing a small function", "Removing spaces and lowering the case", "Testing it on a messy email"],
          whyList: ["Hidden duplicates only match after cleaning", "A function means the cleaning is the same every time"],
          code: C`
            def clean_email(email):
                return email.strip().lower()

            print(clean_email("  Maya.R@Email.com "))
          `,
          talk: C`
            Here's the tricky part. Some people signed up twice but typed their email a little differently. One has capital letters, one has an extra space. To a computer, those look like different people.

            So we write a small function called clean_email. def starts the function, and email is the input. strip removes spaces at the start and end, and lower makes it all lowercase. return hands back the cleaned version.

            Then we test it on a messy email. This is a good habit: test small pieces before you use them in something bigger.
          `,
          see: "maya.r@email.com",
          nudge: "def clean_email(email): then, indented, return email.strip().lower()",
          success: "Now messy emails and clean emails will match.",
          check: C`
            need("clean_email", "I can't find clean_email. Start it with def clean_email(email):")
            f = ns["clean_email"]
            tests = {"  Maya.R@Email.com ": "maya.r@email.com", "TOM@X.COM": "tom@x.com", "a@b.co ": "a@b.co"}
            for given, want in tests.items():
                got = f(given)
                if got != want:
                    fail(f"clean_email({given!r}) gave {got!r}, but it should give {want!r}. Use .strip() and .lower(), and return the result.")
          `
        },
        {
          title: "Count each person",
          task: "Count how many times each cleaned email appears, then list the ones that appear more than once.",
          why: "Counting by clean email finds every duplicate, including the hidden ones.",
          doing: ["Making a dictionary of email to count", "Adding 1 for each sign-up", "Listing emails with a count over 1"],
          whyList: ["Dictionaries are perfect for tallying", "This is the same idea as COUNTIF in Excel"],
          code: C`
            counts = {}
            for row in rows:
                email = clean_email(row["email"])
                counts[email] = counts.get(email, 0) + 1

            dupe_emails = [email for email, n in counts.items() if n > 1]
            print(len(dupe_emails), "people signed up more than once")
            print(dupe_emails)
          `,
          talk: C`
            Now we count how many times each person signed up. We use a dictionary called counts. Think of it like a tally sheet: each email is a label, and the value is how many times we've seen it.

            For each row, we clean the email with our new function. Then counts.get(email, 0) means "look up this email's count, or use zero if it's new." We add one and save it back.

            The next line is called a list comprehension. Read it like a sentence: give me each email, for every email and count in our tally, if the count is more than one.

            We've gone from 4 exact duplicates to 8 people who signed up more than once. The cleaning found the hidden ones.
          `,
          see: "8 people signed up more than once, then the list of their emails.",
          nudge: "counts = {}. In the loop: counts[email] = counts.get(email, 0) + 1. Then keep emails where the count is over 1.",
          success: "8 people found, including the hidden duplicates.",
          check: C`
            need("counts", "I can't find counts. Start with counts = {} before the loop.")
            need("dupe_emails", "I can't find dupe_emails. Build it from counts: [email for email, n in counts.items() if n > 1]")
            import csv as _csv
            with open("signups.csv") as _f:
                _rows = list(_csv.DictReader(_f))
            _c = {}
            for _r in _rows:
                _e = _r["email"].strip().lower()
                _c[_e] = _c.get(_e, 0) + 1
            want = {e for e, n in _c.items() if n > 1}
            got = set(ns["dupe_emails"])
            if got != want:
                if len(got) == 4:
                    fail("You found only the exact duplicates. Use clean_email(row['email']) inside the loop so the hidden ones match too.")
                fail(f"dupe_emails has {len(got)} emails, but 8 people signed up more than once. Check the counting line: counts[email] = counts.get(email, 0) + 1")
          `
        },
        {
          title: "Keep one of each",
          task: "Build unique_rows, keeping only the first sign-up for each cleaned email.",
          why: "Now you know who's duplicated. This builds the list you'd actually use.",
          doing: ["Tracking which emails we've kept", "Keeping each person's first sign-up", "Comparing before and after"],
          whyList: ["The first sign-up is usually the real one", "Before and after counts prove the cleanup worked"],
          code: C`
            unique_rows = []
            kept = set()
            for row in rows:
                email = clean_email(row["email"])
                if email not in kept:
                    kept.add(email)
                    unique_rows.append(row)

            print(len(rows), "sign-ups ->", len(unique_rows), "real people")
          `,
          talk: C`
            We know who the duplicates are. Now let's build a clean list with one sign-up per person.

            This looks a lot like the exact-duplicate step, and that's on purpose. We have a set called kept to remember which emails we've already kept. For each row, we clean the email. If it's not in kept yet, it's someone new, so we keep their row and remember their email.

            If we've seen them already, we skip them. That means we always keep each person's first sign-up.

            Then we print before and after: 37 sign-ups, but only 28 real people.
          `,
          see: "37 sign-ups -> 28 real people",
          nudge: "Same pattern as step 2, but compare clean_email(row[\"email\"]) and use if email not in kept.",
          success: "37 sign-ups, 28 real people. Now the headcount is right.",
          check: C`
            need("unique_rows", "I can't find unique_rows. Start with unique_rows = [] before the loop.")
            u = ns["unique_rows"]
            if len(u) != 28:
                fail(f"unique_rows has {len(u)} people, but there are 28. Make sure you compare clean_email(row['email']), not the raw email.")
            emails = [r["email"].strip().lower() for r in u]
            if len(set(emails)) != len(emails):
                fail("unique_rows still has someone twice. Add each email to kept right after you keep their row.")
          `
        },
        {
          title: "Write a duplicates report",
          task: "Save duplicates_report.csv listing each duplicated email and how many times it signed up.",
          why: "Your team needs to see who was duplicated, not just trust that you fixed it.",
          doing: ["Creating a report file", "Writing a header row", "Writing one row per duplicated email"],
          whyList: ["A report makes your work visible and checkable", "Someone may need to contact these people"],
          code: C`
            with open("duplicates_report.csv", "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(["email", "times_signed_up"])
                for email in dupe_emails:
                    writer.writerow([email, counts[email]])

            print("Saved duplicates_report.csv")
          `,
          talk: C`
            Good data work is checkable work. So let's save a report that shows exactly who was duplicated.

            We open a new file for writing. csv.writer writes rows as lists. The first writerow is our header: email, and times signed up.

            Then we loop through our duplicate emails and write each one, along with its count from our tally dictionary.

            Open the file on the left. You'll see Priya signed up three times. Without this script, nobody would have noticed.
          `,
          see: "Saved duplicates_report.csv. Open it: 8 emails, including one that signed up 3 times.",
          nudge: "Open the file with \"w\", make writer = csv.writer(f), write the header row, then loop over dupe_emails.",
          success: "Report saved. Your work is visible and checkable.",
          check: C`
            if not exists("duplicates_report.csv"):
                fail("I can't find duplicates_report.csv. Check the file name inside open( ).")
            lines = [l for l in read_text("duplicates_report.csv").splitlines() if l.strip()]
            if not lines or lines[0].strip() != "email,times_signed_up":
                fail("The first row should be the header: email,times_signed_up")
            if len(lines) != 9:
                fail(f"The report has {len(lines) - 1} rows, but it should list 8 duplicated emails. Loop over dupe_emails.")
          `
        },
        {
          title: "Save the clean list",
          task: "Save unique_rows as signups_clean.csv, with the same columns as the original.",
          why: "This is the deliverable: a clean list ready for name tags, emails and headcounts.",
          doing: ["Creating the clean file", "Using the original column names", "Writing every unique person"],
          whyList: ["Keep the original file untouched as a backup", "The clean list is what the events team will use"],
          code: C`
            with open("signups_clean.csv", "w", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=rows[0].keys())
                writer.writeheader()
                writer.writerows(unique_rows)

            print("Saved", len(unique_rows), "people to signups_clean.csv")
          `,
          talk: C`
            Last step: save the clean list. This time we use DictWriter, because our rows are dictionaries.

            For the column names, we borrow them from the original file using rows[0].keys(). That way our clean file has exactly the same columns as the original, in the same order.

            writeheader writes the column names, and writerows writes all 28 people.

            And just like before, we save it as a new file. The original stays untouched, so we can always go back to it.
          `,
          see: "Saved 28 people to signups_clean.csv",
          nudge: "Use csv.DictWriter(f, fieldnames=rows[0].keys()), then writeheader() and writerows(unique_rows).",
          success: "Clean list saved. 28 real people, zero duplicates.",
          check: C`
            if not exists("signups_clean.csv"):
                fail("I can't find signups_clean.csv. Check the file name inside open( ).")
            lines = [l for l in read_text("signups_clean.csv").splitlines() if l.strip()]
            if not lines or lines[0].strip() != "name,email,phone,event,signup_date":
                fail("The header should match the original: name,email,phone,event,signup_date. Use fieldnames=rows[0].keys() and writeheader().")
            if len(lines) != 29:
                fail(f"The file has {len(lines) - 1} people, but it should have 28. Write unique_rows, not rows.")
          `
        }
      ],
      recap: ["Read a CSV into a list of dictionaries", "Use a set to spot repeats", "Clean values before comparing them", "Tally with a dictionary", "Keep the first of each record", "Save a report and a clean file"],
      wrapUp: C`
        We started with 37 sign-ups and found out there are really only 28 people. Four people clicked submit twice, and five more were hiding behind messy emails.

        The big lesson here works far beyond sign-up forms: clean first, then compare. Whether it's customers, products or addresses, the same trick finds duplicates everywhere.

        For practice, try matching on phone number instead of email, and see if you find the same people. See you in the next project.
      `
    },

    /* ---------------------------------------------------------------
       5. BUILD A RELATIONAL DATABASE
       --------------------------------------------------------------- */
    {
      id: "relational-db",
      title: "Build a Relational Database",
      lang: "sql",
      file: "clinic.sql",
      files: ["clinic.db"],
      db: { name: "clinic.db", seed: null, fresh: true },
      difficulty: "Intermediate",
      minutes: 40,
      skills: ["SQL", "Tables", "Keys", "JOINs"],
      tagline: "Design connected tables for a pet clinic, then query across them.",
      art: "nodes",
      starter: C`
        -- Build a Relational Database
        -- Goal: design a database for a pet clinic, fill it, and query across tables.
        -- Each run starts with an empty database, so your whole file runs top to bottom.

      `,
      briefing: {
        mission: "A neighborhood pet clinic keeps everything in one messy spreadsheet. You'll design a real database with three connected tables, owners, pets and visits, then answer questions that need all three.",
        jobUse: [
          "Nearly every app, from banks to online stores, stores data in related tables",
          "Understanding keys and JOINs is what lets you query real company databases",
          "Designing tables is a core skill for analysts, developers and data engineers"
        ],
        talk: C`
          In this project, we're going to build a database from scratch, the same way real apps are built.

          Here's the idea. A pet clinic has owners, pets, and visits. You could put all of that in one giant spreadsheet. But then every time Maya brings her dog in, you'd type her name and phone number again. If her number changes, you'd have to fix it in twenty places, and you'd miss some.

          A relational database fixes that. Each kind of thing gets its own table, owners, pets and visits, and the tables point to each other using IDs. Maya's phone number lives in exactly one place.

          This is how almost every app you use works behind the scenes, from your bank to online shopping. If you want to work with data, understanding how tables connect, and how to pull them back together with JOIN, is a huge step up.
        `
      },
      steps: [
        {
          title: "Create the owners table",
          task: "Create a table called owners with owner_id as the primary key, plus name and phone.",
          why: "Every database starts with its tables. The primary key gives each owner a unique ID.",
          doing: ["Creating our first table", "Giving each owner a unique ID with PRIMARY KEY", "Adding name and phone columns"],
          whyList: ["The primary key is how other tables point to an owner", "NOT NULL stops someone saving an owner with no name"],
          code: C`
            CREATE TABLE owners (
              owner_id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              phone TEXT
            );
          `,
          talk: C`
            Let's build our first table. CREATE TABLE owners makes a new, empty table called owners.

            Inside the parentheses, we list the columns. Each one has a name and a type. INTEGER means a whole number, and TEXT means words.

            owner_id is special. PRIMARY KEY means this is the unique ID for each owner. No two owners can ever share the same ID. It's like a customer number. Other tables will use it to point to an owner.

            NOT NULL on name means a name is required. The database won't let anyone save an owner without one. That's the database protecting itself from bad data.
          `,
          see: "A message saying the CREATE statement ran. Nothing to look at yet, since the table is empty.",
          nudge: "CREATE TABLE owners ( ... ); with owner_id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT. Separate the columns with commas.",
          success: "Your first table exists.",
          check: C`
            cols = table_columns("owners")
            if cols is None:
                fail("I can't find a table called owners yet. Start with CREATE TABLE owners ( ... ); and end with a semicolon.")
            names = [c["name"] for c in cols]
            for want in ["owner_id", "name", "phone"]:
                if want not in names:
                    fail(f"The owners table is missing a column called {want}.")
            if [c["name"] for c in cols if c["pk"]] != ["owner_id"]:
                fail("Make owner_id the primary key: owner_id INTEGER PRIMARY KEY")
          `
        },
        {
          title: "Create the pets table",
          task: "Create a pets table with its own ID, and an owner_id that points to the owners table.",
          why: "This is the 'relational' part. Each pet points to its owner instead of copying their details.",
          doing: ["Creating the pets table", "Adding owner_id to link each pet to an owner", "Setting up a FOREIGN KEY so the link is enforced"],
          whyList: ["A foreign key connects two tables", "It stops a pet from pointing to an owner who doesn't exist"],
          code: C`
            CREATE TABLE pets (
              pet_id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              species TEXT,
              owner_id INTEGER,
              FOREIGN KEY (owner_id) REFERENCES owners(owner_id)
            );
          `,
          talk: C`
            Now the pets. Each pet gets its own ID, a name and a species, like dog or cat.

            Here's the key part. Instead of typing the owner's name and phone into this table, we store just their owner_id. That's the link. If Maya is owner number 1, her pets just say "owner 1."

            The last line makes the link official. FOREIGN KEY says: owner_id in this table refers to owner_id in the owners table. Now the database will refuse to save a pet that points to an owner who doesn't exist.

            A primary key is a table's own ID. A foreign key is a pointer to another table's ID. That's the whole secret of relational databases.
          `,
          see: "Another CREATE message.",
          nudge: "Same shape as owners. Add owner_id INTEGER, then on the last line: FOREIGN KEY (owner_id) REFERENCES owners(owner_id)",
          success: "Pets now point to their owners.",
          check: C`
            cols = table_columns("pets")
            if cols is None:
                fail("I can't find a table called pets yet. Use CREATE TABLE pets ( ... );")
            names = [c["name"] for c in cols]
            for want in ["pet_id", "name", "species", "owner_id"]:
                if want not in names:
                    fail(f"The pets table is missing a column called {want}.")
            if [c["name"] for c in cols if c["pk"]] != ["pet_id"]:
                fail("Make pet_id the primary key: pet_id INTEGER PRIMARY KEY")
            fks = foreign_keys("pets")
            if not any(f["from"] == "owner_id" and f["table"] == "owners" for f in fks):
                fail("Link pets to owners. Add this as the last line inside the parentheses: FOREIGN KEY (owner_id) REFERENCES owners(owner_id)")
          `
        },
        {
          title: "Create the visits table",
          task: "Create a visits table where each visit points to a pet, with a date, reason and cost.",
          why: "Visits connect to pets, and pets connect to owners. That chain lets you answer questions across all three.",
          doing: ["Creating the visits table", "Linking each visit to a pet with a foreign key", "Storing cost as a decimal number"],
          whyList: ["Owners -> pets -> visits is a chain of links", "REAL is the type for decimal numbers like money"],
          code: C`
            CREATE TABLE visits (
              visit_id INTEGER PRIMARY KEY,
              pet_id INTEGER,
              visit_date TEXT,
              reason TEXT,
              cost REAL,
              FOREIGN KEY (pet_id) REFERENCES pets(pet_id)
            );
          `,
          talk: C`
            Our third table: visits. Every time a pet comes into the clinic, that's a visit.

            Same pattern again. Each visit has its own ID, and a pet_id pointing to the pet that came in. Then the date, the reason and the cost. REAL is the type for numbers with decimals, which is perfect for money.

            Now we have a chain. A visit points to a pet, and a pet points to an owner. So if we want to know how much Maya has spent, we can follow the chain: Maya, to her pets, to their visits.
          `,
          see: "Another CREATE message. All three tables now exist.",
          nudge: "Same shape again. The foreign key line is FOREIGN KEY (pet_id) REFERENCES pets(pet_id)",
          success: "Three connected tables. That's a real database design.",
          check: C`
            cols = table_columns("visits")
            if cols is None:
                fail("I can't find a table called visits yet. Use CREATE TABLE visits ( ... );")
            names = [c["name"] for c in cols]
            for want in ["visit_id", "pet_id", "visit_date", "reason", "cost"]:
                if want not in names:
                    fail(f"The visits table is missing a column called {want}.")
            if [c["name"] for c in cols if c["pk"]] != ["visit_id"]:
                fail("Make visit_id the primary key: visit_id INTEGER PRIMARY KEY")
            fks = foreign_keys("visits")
            if not any(f["from"] == "pet_id" and f["table"] == "pets" for f in fks):
                fail("Link visits to pets: FOREIGN KEY (pet_id) REFERENCES pets(pet_id)")
          `
        },
        {
          title: "Add the owners",
          task: "Insert four owners into the owners table.",
          why: "Tables are empty until you add rows. INSERT is how data gets into every database.",
          doing: ["Adding four owners in one statement", "Giving each one an ID, name and phone"],
          whyList: ["INSERT is how every app saves new data", "Owners go first, because pets need an owner to point to"],
          code: C`
            INSERT INTO owners (owner_id, name, phone) VALUES
              (1, 'Maya Robinson', '704-555-0101'),
              (2, 'Luis Ortega', '901-555-0102'),
              (3, 'Priya Patel', '404-555-0103'),
              (4, 'Derek Chen', '713-555-0104');
          `,
          talk: C`
            Our tables exist, but they're empty. Time to add data.

            INSERT INTO owners says which table. Then in parentheses, we list which columns we're filling in. After VALUES, each set of parentheses is one row, in the same order as the columns.

            We can add several rows at once by separating them with commas. Only the very last one gets the semicolon.

            Notice we add owners first. That's because of our foreign key. A pet has to point to an owner who already exists.
          `,
          see: "A message saying 4 rows were inserted.",
          nudge: "INSERT INTO owners (owner_id, name, phone) VALUES, then one ( ... ) per owner, separated by commas.",
          success: "Four owners saved.",
          check: C`
            if table_columns("owners") is None:
                fail("The owners table is missing. Keep your CREATE TABLE statements above your INSERT.")
            n = row_count("owners")
            if n != 4:
                fail(f"The owners table has {n} rows, but it should have 4. Each owner needs their own ( ... ) after VALUES.")
          `
        },
        {
          title: "Add the pets",
          task: "Insert six pets, each pointing to an owner by owner_id.",
          why: "Each pet stores just a number to find its owner. No copying names or phone numbers.",
          doing: ["Adding six pets", "Linking each one to an owner with owner_id"],
          whyList: ["Maya's details live in one place, no matter how many pets she has", "The foreign key checks that every owner_id is real"],
          code: C`
            INSERT INTO pets (pet_id, name, species, owner_id) VALUES
              (1, 'Biscuit', 'Dog', 1),
              (2, 'Mochi', 'Cat', 1),
              (3, 'Pepper', 'Dog', 2),
              (4, 'Kiwi', 'Bird', 3),
              (5, 'Luna', 'Cat', 4),
              (6, 'Rex', 'Dog', 4);
          `,
          talk: C`
            Now the pets. Look at the last number in each row. That's the owner_id.

            Biscuit and Mochi both have owner 1, so they both belong to Maya. Luna and Rex both belong to owner 4, Derek.

            Here's the beauty of it. Maya has two pets, but her name and phone number are stored only once, in the owners table. If her phone number changes, we update one row and every pet is still connected.

            And try this for fun on camera: change one owner_id to 99 and run it. The database refuses, because owner 99 doesn't exist. That's the foreign key protecting the data. Then change it back.
          `,
          see: "A message saying 6 rows were inserted.",
          nudge: "INSERT INTO pets (pet_id, name, species, owner_id) VALUES, then one row per pet. The last number is the owner's ID.",
          success: "Six pets, each linked to an owner.",
          check: C`
            if table_columns("pets") is None:
                fail("The pets table is missing. Keep your CREATE TABLE statements above your INSERTs.")
            n = row_count("pets")
            if n != 6:
                fail(f"The pets table has {n} rows, but it should have 6.")
            orphans = conn.execute("SELECT COUNT(*) FROM pets WHERE owner_id NOT IN (SELECT owner_id FROM owners)").fetchone()[0]
            if orphans:
                fail("Some pets point to an owner that doesn't exist. Every owner_id should be 1, 2, 3 or 4.")
          `
        },
        {
          title: "Add the visits",
          task: "Insert eight visits, each pointing to a pet by pet_id.",
          why: "Now the database has a history, so you can answer real questions about it.",
          doing: ["Adding eight visits", "Linking each visit to a pet", "Recording the date, reason and cost"],
          whyList: ["This completes the chain: owners -> pets -> visits", "Dates are stored as YYYY-MM-DD so they sort correctly"],
          code: C`
            INSERT INTO visits (visit_id, pet_id, visit_date, reason, cost) VALUES
              (1, 1, '2026-01-14', 'Checkup', 65.00),
              (2, 3, '2026-01-20', 'Vaccines', 90.00),
              (3, 2, '2026-02-03', 'Dental cleaning', 180.00),
              (4, 5, '2026-02-11', 'Checkup', 65.00),
              (5, 1, '2026-03-02', 'Ear infection', 120.00),
              (6, 4, '2026-03-15', 'Wing trim', 35.00),
              (7, 3, '2026-04-08', 'Checkup', 65.00),
              (8, 1, '2026-04-22', 'Vaccines', 90.00);
          `,
          talk: C`
            Last batch of data: the visits. The second number in each row is the pet_id, so it says which pet came in.

            Pet 1 is Biscuit, and Biscuit shows up three times. That's one busy dog.

            The dates are written year, month, day. That's on purpose. Written that way, dates sort in the right order, even as text.

            Notice one pet never shows up here. Keep that in your back pocket, because we'll find that pet with a query at the end.
          `,
          see: "A message saying 8 rows were inserted.",
          nudge: "INSERT INTO visits (visit_id, pet_id, visit_date, reason, cost) VALUES, then one row per visit.",
          success: "The database is full. Time to ask it questions.",
          check: C`
            if table_columns("visits") is None:
                fail("The visits table is missing. Keep your CREATE TABLE statements above your INSERTs.")
            n = row_count("visits")
            if n != 8:
                fail(f"The visits table has {n} rows, but it should have 8.")
            total = conn.execute("SELECT ROUND(SUM(cost), 2) FROM visits").fetchone()[0]
            if total != 710.0:
                fail("The visit costs don't add up to what's expected. Double-check the cost at the end of each row.")
          `
        },
        {
          title: "Your first JOIN",
          task: "List every pet's name next to its owner's name.",
          why: "The data lives in two tables. JOIN stitches them back together using the IDs.",
          doing: ["Joining pets to owners", "Matching on owner_id", "Renaming the columns pet and owner"],
          whyList: ["JOIN is how you combine related tables", "Both tables have a name column, so we say which one we mean"],
          code: C`
            SELECT pets.name AS pet, owners.name AS owner
            FROM pets
            JOIN owners ON pets.owner_id = owners.owner_id;
          `,
          talk: C`
            Here's the payoff. Our pet names are in one table, and owner names are in another. JOIN brings them back together.

            FROM pets JOIN owners says we're using both tables. The ON part is the rule for matching them up: a pet's owner_id has to equal an owner's owner_id. That's our link from before, being used.

            Since both tables have a column called name, we have to be specific. pets.name means the name from the pets table, and owners.name means the one from owners. Then AS gives them clear labels, pet and owner.
          `,
          see: "Six rows: each pet next to its owner. Biscuit and Mochi with Maya Robinson.",
          nudge: "SELECT pets.name AS pet, owners.name AS owner FROM pets JOIN owners ON pets.owner_id = owners.owner_id;",
          success: "Two tables, stitched back together.",
          check: C`
            expect_query("SELECT pets.name AS pet, owners.name AS owner FROM pets JOIN owners ON pets.owner_id = owners.owner_id", ordered=False, names=["pet", "owner"])
          `
        },
        {
          title: "Spending per owner",
          task: "Join all three tables to show each owner's number of visits and total spent, highest first.",
          why: "This is a real business question that needs all three tables, and it's why the links matter.",
          doing: ["Joining owners to pets to visits", "Grouping by owner", "Counting visits and adding up cost"],
          whyList: ["You can JOIN as many tables as the chain needs", "JOIN plus GROUP BY answers most real business questions"],
          code: C`
            SELECT
              owners.name AS owner,
              COUNT(visits.visit_id) AS visits,
              SUM(visits.cost) AS total_spent
            FROM owners
            JOIN pets ON pets.owner_id = owners.owner_id
            JOIN visits ON visits.pet_id = pets.pet_id
            GROUP BY owners.owner_id
            ORDER BY total_spent DESC;
          `,
          talk: C`
            Now a question the clinic manager would really ask: who are our best clients?

            To answer it, we follow the whole chain. Start at owners. JOIN pets, where the pet's owner_id matches the owner. Then JOIN visits, where the visit's pet_id matches the pet. Now every visit is connected all the way back to an owner.

            Then it's the same GROUP BY we've used before. Group by owner, count their visits, and add up the cost. Sort it so the biggest spender is on top.

            Maya comes out on top, with four visits across her two pets. We could never get that answer from one table alone.
          `,
          see: "Four rows. Maya Robinson is on top with 4 visits and 455.0 spent.",
          nudge: "FROM owners, then JOIN pets ON pets.owner_id = owners.owner_id, then JOIN visits ON visits.pet_id = pets.pet_id. GROUP BY owners.owner_id.",
          success: "Three tables, one answer. That's real SQL.",
          check: C`
            expect_query("SELECT owners.name AS owner, COUNT(visits.visit_id) AS visits, SUM(visits.cost) AS total_spent FROM owners JOIN pets ON pets.owner_id = owners.owner_id JOIN visits ON visits.pet_id = pets.pet_id GROUP BY owners.owner_id ORDER BY total_spent DESC", ordered=True, names=["owner", "visits", "total_spent"])
          `
        },
        {
          title: "Find pets with no visits",
          task: "Use a LEFT JOIN to find the pet that has never had a visit.",
          why: "Finding what's missing is just as useful as finding what's there. The clinic should call this owner.",
          doing: ["Keeping every pet with LEFT JOIN, even without visits", "Filtering to pets where no visit matched"],
          whyList: ["A normal JOIN hides rows with no match. LEFT JOIN keeps them.", "'Who hasn't…?' questions are common: customers who never ordered, users who never logged in"],
          code: C`
            SELECT pets.name AS pet
            FROM pets
            LEFT JOIN visits ON visits.pet_id = pets.pet_id
            WHERE visits.visit_id IS NULL;
          `,
          talk: C`
            Last query, and it's a clever one. Remember the pet that never showed up in visits? Let's find it with SQL.

            A normal JOIN only keeps rows that match. A pet with no visits has nothing to match, so it would just disappear. LEFT JOIN is different. It keeps every pet from the left side, the pets table, even if there's no matching visit. When there's no match, the visit columns are just empty. In SQL, empty is called NULL.

            So we filter with WHERE visits.visit_id IS NULL. That means "only show pets where no visit was found."

            And there's Rex. In a real clinic, that's a reminder call for a checkup. In a real business, this same pattern finds customers who never ordered, or users who signed up and never came back.
          `,
          see: "One row: Rex.",
          nudge: "Use LEFT JOIN instead of JOIN, then WHERE visits.visit_id IS NULL. Note: IS NULL, not = NULL.",
          success: "Found Rex. Time for a checkup reminder.",
          check: C`
            expect_query("SELECT pets.name AS pet FROM pets LEFT JOIN visits ON visits.pet_id = pets.pet_id WHERE visits.visit_id IS NULL", ordered=False, names=["pet"])
          `
        }
      ],
      recap: ["Design tables with CREATE TABLE", "Give rows unique IDs with PRIMARY KEY", "Connect tables with FOREIGN KEY", "Add data with INSERT", "Combine tables with JOIN", "Total across three tables", "Find what's missing with LEFT JOIN"],
      wrapUp: C`
        We just built a real database from nothing. We designed three tables, connected them with keys, filled them with data, and asked questions that needed all three tables to answer.

        This is how the apps you use every day store their data. Now, when you hear words like primary key, foreign key and JOIN in a job interview, you've actually used them.

        For practice, try adding a fourth table, maybe vets, so each visit records which vet saw the pet. Then write a query showing how many visits each vet handled. Great work, and I'll see you next time.
      `
    }
  ];
})();
