/* =====================================================================
   horizon.dev — Python for Beginners: live class scripts
   Written for teaching live over Zoom (and for recording). Each session has:
     opening  -> welcome, how class works, setup checklist, why this matters at work
     steps    -> for each step: talk (the script), lines (line-by-line meaning),
                 check (a question to ask the class, with the answer),
                 watch (common mistakes and how to fix them), recap, minutes
     closing  -> recap, homework, questions people usually ask, what's next
   The Instructor View reads this file. Learners never see it.
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
  const SERIES = "Python for Beginners";
  const CLASS = {};

  /* ================================================================
     SESSION 1 · Spin Cycle · Clean a Messy CSV
     ================================================================ */
  CLASS["clean-csv"] = {
    session: 1,
    opening: {
      minutes: 5,
      talk: T`
        Hi everyone, and welcome to Python for Beginners. I'm really glad you're here. Before we write a single line of code, I want you to know one thing: you don't need any experience for this. If you've never coded before, you're exactly who this class is for. I'll explain every word we type, and why we type it.

        Here's how our time together works. We're going to build one small, real project from start to finish. Today it's called Spin Cycle. A small online shop exported its customer list, and it's a mess. Random capital letters, blank rows, money stored as text, and dates written three different ways. By the end of class, we'll have turned it into a clean file the team can actually use.

        Why start here? Because this is real work. Analysts, marketing coordinators and operations people spend a huge part of their week cleaning data exactly like this. Doing it by hand in Excel takes hours. Doing it with a Python script takes seconds, and it's the same every single time. That's the skill employers are looking for.

        Let's get set up. Open horizon.dev, click Spin Cycle, and you'll see a mission card in the middle of the screen. Don't click anything yet. Take a look at the left side of the screen. That's your file list. You'll see two files: cleaning.py, which is where we'll write our code, and customers_messy.csv, which is the messy data. In the middle is the editor, where you type. The Run button is at the top right.

        Here's the rhythm for every step. I'll explain what we're being asked to do and why. We'll type the code together. You'll click Run to see what happens, then click Check my work, and the app will tell you if you got it, or explain what's off. If you get stuck, there's a Hint button. Using it is not cheating. It's what it's there for.

        Once you can see the mission card, drop a 1 in the chat. When everyone's ready, click Accept mission, and let's start.
      `,
      setup: [
        "horizon.dev is open, and Spin Cycle is selected",
        "They can see cleaning.py and customers_messy.csv on the left",
        "They know where Run, Check my work and Hint are",
        "Everyone has dropped a 1 in the chat"
      ]
    },
    steps: [
      {
        minutes: 6,
        talk: T`
          Alright, step one. We're being asked to open customers_messy.csv and look at the first few rows. So here's what we'll do: bring in a tool called pandas, use it to load the file, and print a preview. And here's why: you can never fix data you haven't looked at. Every cleaning job, at every company, starts with a peek.

          Let's talk about pandas first, because it's going to be our main tool today. Python on its own is great at a lot of things, but it doesn't really understand spreadsheets. pandas is a free add-on that makes Python great at tables. The easiest way to think about it: pandas is Excel, but inside Python.

          Go ahead and type the first line with me: import pandas as pd. "import" means "bring in a tool someone else already built." The "as pd" part gives it a short nickname, so we can type pd instead of pandas every time. Everyone in the data world uses that same nickname, so you'll see pd everywhere.

          Next line. We want to read our file, so we write pd.read_csv, and inside the parentheses, the file name in quotes. Look at your file list on the left to get the name exactly right. Python won't guess. One wrong letter and it'll tell you it can't find the file.

          We store the result in df. df is a variable. A variable is just a labeled box that holds something. Here, the box holds our whole table. Now any time we say df, Python knows we mean that table.

          Last line: print(df.head()). head gives us the first five rows, and print puts them on screen. Without print, Python does the work quietly and shows us nothing.

          Click Run. Now look at those five rows with me. What do you notice?
        `,
        lines: [
          ["import pandas as pd", "Bring in the pandas tool and give it the short nickname pd."],
          ["df = pd.read_csv(...)", "Read the CSV file into a table, and store that table in a variable called df."],
          ["\"customers_messy.csv\"", "The file's exact name, in quotes, copied from the file list on the left."],
          ["df.head()", "The first five rows of the table."],
          ["print(...)", "Show the result on screen. Without print, nothing appears."]
        ],
        check: {
          q: "Look at the first five rows. Name one thing that looks messy.",
          a: "Any of these: names in ALL CAPS or all lowercase, extra spaces, emails in capitals, dates written in different styles, money with dollar signs and commas. These are exactly what we'll fix, step by step."
        },
        watch: [
          "FileNotFoundError: the file name is misspelled. It must be customers_messy.csv with an underscore, inside quotes.",
          "Nothing shows up: they forgot print( ) around df.head().",
          "NameError: name 'pd' is not defined: the import line is missing or misspelled."
        ],
        recap: "Before you clean anything, load it and look at it."
      },
      {
        minutes: 5,
        talk: T`
          Step two. We're being asked to measure the mess: how big is the table, and where are the blanks? So here's what we'll do: print the table's size, then count the blank cells in every column. And here's why: we want "before" numbers. At the end of class, we'll compare, and that's how we prove our cleaning worked. In a real job, that's how you show your manager your work is right.

          Type print(df.shape). shape is the size of the table: rows first, then columns. Notice there are no parentheses after shape. That's because shape isn't an action. It's just a fact about the table, like its height and width.

          Next line: print(df.isna().sum()). This one is a chain of two steps, so let's read it slowly. isna means "is this cell empty?" It checks every single cell in the table. Then sum adds up the empty ones, column by column. When you put dots one after another like this, it's called chaining. Each step works on the result of the step before it.

          Click Run. You should see 29 comma 6. That's 29 rows and 6 columns. Then a list of columns with a number next to each. Every column has 3 blanks, and EMAIL has 6.

          Here's a little detective question for you. Every column has exactly 3 blanks. What might that tell us? Think about it, because the answer is our next big clue.
        `,
        lines: [
          ["df.shape", "The table's size, written as (rows, columns). No parentheses, because it's a fact, not an action."],
          ["df.isna()", "Check every cell: is it empty? True if yes, False if no."],
          [".sum()", "Add up the empty cells in each column."],
          ["print(...)", "Show each answer on screen."]
        ],
        check: {
          q: "Every column has exactly 3 blanks. What could that mean?",
          a: "There are probably 3 rows that are completely empty. Every column is blank on those same 3 rows. The email column has 3 more blanks because 3 real customers didn't give an email."
        },
        watch: [
          "Writing df.shape() with parentheses gives an error. shape has no parentheses.",
          "Writing isna without the parentheses, like df.isna.sum(), gives an error. isna() is an action, so it needs them.",
          "If their numbers don't match, they may have edited the data file. Restart the project to reset it."
        ],
        recap: "Measure first, so you can prove your fix worked."
      },
      {
        minutes: 6,
        talk: T`
          Step three. We're being asked to tidy up the column names: all lowercase, no extra spaces, and underscores between words. So here's what we'll do: run three small text fixes on the names and save them back. And here's why: we'll type these column names over and over today. Right now they're a trap.

          Look at your first printout again. The first column is " Customer ID", and it starts with a space you can't even see. "Name" has a space at the end. "EMAIL" is in capitals. If you typed df["name"], Python would say that column doesn't exist, and you'd have no idea why. Clean names save you from mistakes all day long.

          Here's the line: df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_"). That looks long, so let's take it one piece at a time.

          df.columns is the list of column names. .str means "I'm about to do a text operation on every name in this list." strip removes spaces from the start and end. lower makes everything lowercase. And replace swaps one thing for another. Inside the parentheses, we say what to find, a space, and what to put instead, an underscore.

          Now the most important part: the equals sign at the very start. df.columns equals. That means "store the result back into the column names." Without it, Python would do all that cleaning and then throw it away. This trips up everyone at least once, so if your names don't change, check for that equals sign.

          Last line prints the names as a list, so we can check. Click Run.
        `,
        lines: [
          ["df.columns", "The list of column names."],
          [".str", "Do a text operation on every name in the list at once."],
          [".strip()", "Remove spaces at the start and end."],
          [".lower()", "Make every letter lowercase."],
          [".replace(\" \", \"_\")", "Find each space and put an underscore instead."],
          ["df.columns = ...", "Save the cleaned names back. Without this, the change is thrown away."],
          [".tolist()", "Turn the names into a plain list so they print neatly."]
        ],
        check: {
          q: "What would happen if we left off \"df.columns =\" at the start of the line?",
          a: "Python would clean the names but not save them. The column names would stay messy. Saving with = is how a change sticks."
        },
        watch: [
          "Names unchanged: they left off df.columns = at the start.",
          "AttributeError: they wrote .strip() without .str in front. Every text tool needs .str first when it's used on a whole list.",
          "Quotes: replace needs a space in quotes, then an underscore in quotes: (\" \", \"_\")."
        ],
        recap: "Tidy names first, so every later step is easier to type."
      },
      {
        minutes: 6,
        talk: T`
          Step four. We're being asked to remove the rows that are completely empty, and turn the customer IDs back into whole numbers. So here's what we'll do: drop the blank rows, fix the ID column, and count what's left. And here's why: those 3 empty rows from earlier add nothing, and they'd throw off every count we make.

          The tool for removing blanks is dropna. It's "drop" plus "na," which is short for "not available." So, drop the blanks. But here's where we have to be careful, and this is one of the most important lessons today.

          By default, dropna removes any row that has even one blank cell. Remember the 3 real customers who didn't give an email? They have one blank cell. dropna would delete them too, and we'd lose real people who spent real money. So we add how equals "all". That means: only drop a row if all of its cells are blank. Reading the task carefully, "completely empty," is how you know you need that.

          Notice we write df equals at the start again. dropna gives us back a new, cleaned table, and we save it into df.

          Next, the IDs. If you looked closely at the first printout, they showed as 1001.0, with a decimal. That happened because of the blank rows. Now that they're gone, astype(int) turns the IDs back into whole numbers. int is short for integer, which just means a whole number.

          Last line counts the rows with len, short for length. Click Run. We should have 26 real customers.
        `,
        lines: [
          ["df.dropna(how=\"all\")", "Remove rows where every cell is blank. Rows with only some blanks stay."],
          ["df = ...", "Save the cleaned table back into df."],
          ["df[\"customer_id\"]", "Pick one column by its name."],
          [".astype(int)", "Convert the column to whole numbers, so 1001.0 becomes 1001."],
          ["len(df)", "Count the rows in the table."]
        ],
        check: {
          q: "If we used dropna() without how=\"all\", how many rows would we end up with, and why is that a problem?",
          a: "23 instead of 26. It would also delete the 3 real customers who are only missing an email. Losing real customers would make every total wrong."
        },
        watch: [
          "23 rows instead of 26: they left out how=\"all\".",
          "\"Cannot convert non-finite values\" on astype(int): the dropna line didn't save, so blanks are still there. Check for df = at the start.",
          "Quotes around all: it's how=\"all\", with quotes."
        ],
        recap: "Drop only what's truly empty. Never delete real records by accident."
      },
      {
        minutes: 6,
        talk: T`
          Step five. We're being asked to fix the spacing and capital letters in the name, city and email columns. So here's what we'll do: clean each column and save it back. And here's why: to you and me, "memphis" and "MEMPHIS" are the same city. To a computer, they're completely different. If we made a report by city right now, Memphis would show up three times.

          To work with one column, we write df, square brackets, and the column name in quotes. So df["name"] means the name column. That's how you pick a column, and you'll use it constantly.

          For names and cities, we use strip, which you already know, then title. title capitalizes the first letter of each word, like Maya Robinson or New Orleans. That's how names and places are normally written.

          For emails, we use lower instead. Email addresses are compared exactly, so the standard is all lowercase.

          Notice every line has the same shape: take a column, clean it, and save it back into that same column. Once you see that pattern, these lines are easy to write.

          The last line uses double square brackets. That one confuses people, so here's the trick: the inner brackets make a list of column names, and the outer brackets pick those columns from the table. So we're previewing three columns at once.

          Click Run. You'll still see NaN in a few email spots. NaN is pandas' word for empty. We'll deal with those in a couple of steps.
        `,
        lines: [
          ["df[\"name\"]", "The name column."],
          [".str.strip()", "Remove extra spaces at the start and end."],
          [".str.title()", "Capitalize the first letter of each word."],
          [".str.lower()", "Make it all lowercase, the standard for emails."],
          ["df[\"name\"] = ...", "Save the cleaned column back in place."],
          ["df[[\"name\", \"city\", \"email\"]]", "Pick several columns at once: the inner brackets are a list, the outer brackets pick from the table."]
        ],
        check: {
          q: "Why do we use title() for names and cities, but lower() for emails?",
          a: "Names and places are normally written with each word capitalized. Emails are compared exactly, and lowercase is the standard, so every email matches no matter how someone typed it."
        },
        watch: [
          "KeyError: 'name': the column names from step 3 weren't saved, so the column is still called 'Name '.",
          "Single brackets in the last line: df[\"name\", \"city\", \"email\"] fails. It needs double brackets.",
          "NaN in the email column is expected. It's handled in step 8."
        ],
        recap: "Consistent text is what makes grouping and matching work."
      },
      {
        minutes: 6,
        talk: T`
          Step six. We're being asked to turn the total_spent column into real numbers we can add up. So here's what we'll do: remove the dollar signs and commas, convert what's left into numbers, and add them up. And here's why: right now, Python sees "$2,276.96" as text, exactly like it sees a word. You can't add up words.

          This is one of the most common problems in real data. Money comes out of systems as text all the time.

          First line. We use replace, which you know from the column names. We replace the dollar sign with empty quotes. Replacing something with nothing is how you delete it. Then we chain a second replace to do the same with commas. The regex=False part just tells pandas to treat the dollar sign as a normal character, because in some search patterns, a dollar sign has a special meaning. You don't need to know more than that today.

          Second line: astype(float). We used astype(int) earlier for whole numbers. float is Python's word for a number with a decimal point, which is exactly what money needs.

          Third line adds up the whole column with sum, and prints it with a label.

          Click Run. You should see Total revenue: 31426.79. And here's a nice way to know it worked: only real numbers can be added up. If even one dollar sign was still in there, the conversion would have stopped with an error.
        `,
        lines: [
          [".str.replace(\"$\", \"\", regex=False)", "Find every dollar sign and replace it with nothing, which deletes it."],
          [".str.replace(\",\", \"\", regex=False)", "Do the same for commas."],
          ["regex=False", "Treat $ as a plain character, not a special search symbol."],
          [".astype(float)", "Convert the text into decimal numbers."],
          ["df[\"total_spent\"].sum()", "Add up every value in the column."]
        ],
        check: {
          q: "What's the difference between int and float?",
          a: "int is a whole number, like 1001. float is a number with a decimal point, like 26.50. Money uses float."
        },
        watch: [
          "\"could not convert string to float\": a $ or comma is still in there. Check both replace calls.",
          "Lines in the wrong order: astype(float) has to come after both replace calls, not before.",
          "Total looks wrong: they might be adding the wrong column. Check the spelling of total_spent."
        ],
        recap: "Text that looks like numbers must be converted before you can do math."
      },
      {
        minutes: 5,
        talk: T`
          Step seven. We're being asked to turn signup_date into real dates, even though it's written three different ways. So here's what we'll do: convert the column with pandas' date tool, and tell it the styles are mixed. And here's why: right now, these dates are just text. We can't sort them properly, and we can't ask a question like "how many people signed up in March?"

          Look at the data. We have 2024-01-10, then 01/20/2024, then January 26 2024. A person reads all three easily. A computer doesn't.

          The tool is pd.to_datetime. You can read the name: convert something to a datetime, which is a real date. Whenever a task says "turn this into dates," that's the one.

          Inside the parentheses, we give it the column, then format equals "mixed". Here's why that matters. Normally, pandas looks at the first date, decides "okay, that's the style," and then fails on any date written differently. format="mixed" tells it to figure out each date on its own.

          And like always, we save it back into the same column.

          Click Run. Every date now shows in the same year-month-day style. And look at the very bottom line: dtype datetime64. dtype means "data type," and datetime64 is pandas telling you these are real dates now.
        `,
        lines: [
          ["pd.to_datetime(...)", "Turn text into real dates."],
          ["df[\"signup_date\"]", "The column to convert."],
          ["format=\"mixed\"", "Work out each date's style one by one, because they're written differently."],
          ["df[\"signup_date\"] = ...", "Save the real dates back into the column."],
          ["dtype: datetime64", "In the output, this confirms the column now holds real dates."]
        ],
        check: {
          q: "Why can't we sort dates properly while they're still text?",
          a: "Text sorts alphabetically, character by character. \"01/20/2024\" would come before \"2024-01-10\" just because 0 comes before 2. Real dates sort by time."
        },
        watch: [
          "ValueError about time data not matching the format: they left out format=\"mixed\".",
          "Writing pd.to_datetime without pd. in front gives a NameError.",
          "Dates look unchanged: they didn't save it back with df[\"signup_date\"] =."
        ],
        recap: "Real dates can be sorted and filtered. Text dates can't."
      },
      {
        minutes: 4,
        talk: T`
          Step eight. We're being asked to fill in the blank emails with the words "not provided". So here's what we'll do: fill the blanks, then recount the blanks everywhere. And here's why: we have a choice to make about those 3 customers, and this is a decision real analysts make all the time.

          We could delete them. But they're real customers who spent real money, and deleting them would make our revenue total wrong. So instead, we label the gap. Anyone who opens this file later sees "not provided" and knows the email is missing on purpose, not because something broke.

          The tool is fillna. It's the opposite of dropna. dropna drops blanks. fillna fills them. Whatever you put in the parentheses goes into every empty cell in that column.

          Then on the next line, we reuse the blank counter from step two: df.isna().sum(). Reusing a check like this is a great habit. You already know it works, and now it proves your fix worked.

          Click Run. Every column should say zero. Remember the "before" numbers we took in step two? 3 and 6 blanks. Now it's all zeros. That's the proof.
        `,
        lines: [
          ["df[\"email\"]", "The email column."],
          [".fillna(\"not provided\")", "Put the words \"not provided\" into every empty cell."],
          ["df[\"email\"] = ...", "Save it back into the column."],
          ["df.isna().sum()", "Count blanks again, to prove there are none left."]
        ],
        check: {
          q: "Why fill in the blank emails instead of deleting those customers?",
          a: "They're real customers who spent real money. Deleting them would make totals wrong. A clear label keeps them and shows the email is missing on purpose."
        },
        watch: [
          "Blanks still show: they didn't save with df[\"email\"] =.",
          "Spelling inside the quotes: the check expects exactly \"not provided\".",
          "If other columns still have blanks, an earlier step didn't save. The dropna in step 4 is the usual one."
        ],
        recap: "Label missing data clearly instead of hiding or deleting it."
      },
      {
        minutes: 5,
        talk: T`
          Last step. We're being asked to save our clean table as a new file called customers_clean.csv. So here's what we'll do: write the table out to a CSV, and print a confirmation. And here's why: all our work so far lives inside Python's memory. Close the window, and it's gone. Saving it is what turns our work into something the team can use.

          We opened the file with read_csv. The partner for saving is to_csv. A lot of pandas works in pairs like that: read_ something to open, to_ something to save.

          Notice we give it a brand-new name. We never overwrite the original file. If anything ever goes wrong, the raw data is still there, and we can start over. That's a habit worth keeping for your whole career.

          Then index=False. pandas keeps its own row numbers, called the index. You saw them down the left side of every printout. If we don't say index=False, pandas saves them as an extra column, and whoever opens your file gets a mystery column of numbers at the front.

          Click Run. Look at the file list on the left. customers_clean.csv just appeared. Click it, and take a look. Clean names, clean emails, real numbers, real dates. That's your work.
        `,
        lines: [
          ["df.to_csv(...)", "Write the table out to a CSV file."],
          ["\"customers_clean.csv\"", "A new file name, so the original stays untouched."],
          ["index=False", "Don't save pandas' row numbers as an extra column."],
          ["print(\"Saved\", len(df), ...)", "Print a confirmation with the number of rows saved."]
        ],
        check: {
          q: "Why do we save to a new file name instead of overwriting customers_messy.csv?",
          a: "So the original stays as a backup. If anything goes wrong, you can always start over from the raw data."
        },
        watch: [
          "An extra 'Unnamed: 0' column in the saved file: they left out index=False.",
          "File doesn't appear: check the spelling of the file name, and that the line ran without an error.",
          "Wrong row count in the saved file: the save line is above some cleaning steps. It needs to be last."
        ],
        recap: "Save to a new file, and keep the original as a backup."
      }
    ],
    closing: {
      minutes: 5,
      talk: T`
        And that's it. Let's look back at what we just did, because it's a lot.

        We started with a file that had blank rows, messy names, money stored as text, and dates in three different styles. We loaded it with pandas, measured the mess, cleaned the column names, removed only the truly empty rows, fixed the text, turned money into real numbers, turned dates into real dates, labeled the missing emails, and saved a clean copy.

        Here's the part I really want you to remember. This whole script is reusable. When next month's export shows up just as messy, you run this same file, and it's done in about a second. That's the difference between someone who cleans data by hand and someone who automates it. And that's something you can talk about in an interview: "I wrote a Python script that cleans our customer export."

        Before we go, let's open it up for questions. Unmute or drop them in the chat. There's no such thing as a silly question in a beginners' class.
      `,
      homework: [
        "Sort the customers by how much they spent, biggest first. Hint: df.sort_values(\"total_spent\", ascending=False).",
        "Count how many customers are in each city. Hint: df[\"city\"].value_counts().",
        "Try the project again from scratch without the Instructor's code, using only hints."
      ],
      questions: [
        { q: "Do I need to memorize all of these commands?", a: "No. Professionals look things up all the time. What matters is knowing what you want to do, like \"remove blanks,\" so you know what to search for." },
        { q: "Can I use this on my own spreadsheets?", a: "Yes. Save your spreadsheet as a CSV, change the file name in read_csv, and adjust the column names to match yours." },
        { q: "What's the difference between pandas and Excel?", a: "Excel is great for looking at data and quick edits. pandas is better for repeatable steps and big files, because the steps are written down and run the same every time." }
      ],
      next: "Next session is Bean Counter, where we'll learn SQL, the language for asking questions of a database, using six months of sales from a coffee company."
    }
  };

  /* ================================================================
     SESSION 2 · Bean Counter · Analyze a Sales Database
     ================================================================ */
  CLASS["sales-sql"] = {
    session: 2,
    opening: {
      minutes: 6,
      talk: T`
        Hi everyone, welcome back to Python for Beginners. If this is your first session, welcome. You don't need anything from before to follow along today.

        Today we're learning SQL. You'll hear people say it "sequel" or "S-Q-L," and both are fine. SQL is the language for asking questions of a database. Now, you might be thinking, "Isn't this a Python class?" It is. But in the real world, Python and SQL are partners. The data you'll work with in Python almost always lives in a database first, and SQL is how you get it out. Almost every data job posting lists both.

        Today's project is called Bean Counter. We're in the back office of a small coffee company called Brew & Bean. They sell coffee, tea, bakery mixes and merch online, and we have six months of their orders in a database. The owner has questions. What's selling? Which region does best? How are we doing month to month? We're going to answer every one of them with SQL.

        A quick word on what a database is, because it sounds more complicated than it is. A database is a file that holds tables. A table is like one tab in a spreadsheet: rows and columns. Each row is one thing, here one order, and each column is one fact about it, like the date or the product.

        Let's get set up. Open horizon.dev and click Bean Counter. On the left, you'll see analysis.sql, which is where we'll write, and sales.db, which is the database. The rhythm is the same as always: I explain what we're being asked and why, we type together, you click Run, then Check my work. The Hint button is there whenever you need it.

        One thing that's different about SQL: you can write several questions in one file. Each one ends with a semicolon, and when you click Run, you'll see a result table for each one. Drop a 1 in the chat when you can see the mission card, and we'll start.
      `,
      setup: [
        "horizon.dev is open, and Bean Counter is selected",
        "They can see analysis.sql and sales.db on the left",
        "They know each SQL question ends with a semicolon",
        "Everyone has dropped a 1 in the chat"
      ]
    },
    steps: [
      {
        minutes: 6,
        talk: T`
          Step one. We're being asked to look at the first 10 rows of the sales table. So here's what we'll do: select every column from the sales table, but only 10 rows. And here's why: you can't answer questions about data until you know what's in it.

          But first, a question that trips up every beginner: how do we even know the table is called sales? Nobody told us. So let's find out. Click sales.db in the file list on the left. This view shows every table inside the database. There's one, called sales, it has 150 rows, and under it are all the column names. In a real job, you'd see the same thing in your company's database tool, or in a document that describes the data. The rule is: always look before you write.

          Now click back on analysis.sql and type with me: SELECT star FROM sales LIMIT 10, and a semicolon.

          Read it out loud like a sentence: select everything from sales, limit 10. SELECT means "show me." The star means "every column." FROM sales says which table to look in. And LIMIT 10 means just the first 10 rows. Real company tables can have millions of rows, so LIMIT is a polite habit.

          The semicolon at the end is like a period at the end of a sentence. It tells the database "my question is finished."

          You'll notice I write the SQL words in capitals. That's not required, SQL doesn't care, but it makes the commands easy to tell apart from the names of things.

          Click Run, then let's look at the columns together.
        `,
        lines: [
          ["SELECT", "\"Show me.\" Every question that reads data starts with SELECT."],
          ["*", "Every column."],
          ["FROM sales", "Look in the table called sales."],
          ["LIMIT 10", "Only show the first 10 rows."],
          [";", "The end of the question."]
        ],
        check: {
          q: "Without looking back, how did we find out the table is called sales?",
          a: "By clicking sales.db in the file list. It lists every table in the database, how many rows each has, and its columns."
        },
        watch: [
          "\"no such table\": the table name is misspelled. It's sales, lowercase, with an s.",
          "Nothing runs: the semicolon is missing.",
          "They typed the query in sales.db instead of analysis.sql. sales.db is read-only. Click analysis.sql to write."
        ],
        recap: "Look at the table's name and columns before writing any query."
      },
      {
        minutes: 6,
        talk: T`
          Step two. We're being asked to show the order date, product and quantity, but only for orders from the South region. So here's what we'll do: list those three columns, and add a filter for the South. And here's why: managers rarely want everything. They want to zoom in on one part of the business.

          Here's my favorite tip for SQL. Listen for the word "only." Only the South. Just this month. Orders over 5. Any time a question narrows things down, that's a filter on rows, and in SQL the filter is always WHERE. An easy way to remember it: SELECT picks the columns, WHERE picks the rows.

          Type a new line below your first query. Instead of the star, we list just the columns the question asked for, separated by commas: order_date, product, quantity. How do we know those exact names? From step one. We saw them at the top of the result table.

          Next line, FROM sales. Then WHERE region equals 'South', and a semicolon.

          Two important details about 'South'. First, it's in single quotes, because it's text. Numbers don't need quotes, but text always does. Second, it has to match exactly, capital S and all. If you type lowercase 'south', the database finds nothing, and it won't tell you why. It'll just give you zero rows.

          Notice I split this across three lines. That's only to make it easier to read. SQL keeps reading until it hits the semicolon.

          Click Run. Scroll the output to the second table. Every row should be from the South.
        `,
        lines: [
          ["SELECT order_date, product, quantity", "Show only these three columns, separated by commas."],
          ["FROM sales", "From the sales table."],
          ["WHERE", "Keep only the rows that pass the test that follows."],
          ["region = 'South'", "The test: the region column must equal the text South."],
          ["'South'", "Text goes in single quotes and must match exactly, including the capital S."]
        ],
        check: {
          q: "In plain English, what's the difference between SELECT and WHERE?",
          a: "SELECT picks which columns you see. WHERE picks which rows you see."
        },
        watch: [
          "Zero rows: they typed 'south' with a lowercase s.",
          "\"no such column: South\": they left out the quotes. Text values go in single quotes.",
          "A comma after the last column, like quantity, FROM, causes a syntax error."
        ],
        recap: "When a question says \"only,\" reach for WHERE."
      },
      {
        minutes: 5,
        talk: T`
          Step three. We're being asked to find the 5 orders with the biggest quantity, biggest first. So here's what we'll do: sort every order by quantity, flip it so the biggest are on top, and keep the top 5. And here's why: "what were our biggest orders?" is one of the most common questions a manager will ever ask you.

          Here's the signal to listen for. Biggest, smallest, top, highest, most recent. Any of those words means sorting. In SQL, sorting is ORDER BY, followed by the column you want to sort on.

          Type it with me: SELECT order_date, product, quantity, FROM sales, ORDER BY quantity DESC, LIMIT 5, semicolon.

          Let's talk about DESC. By default, ORDER BY sorts from smallest to biggest. That's called ascending. DESC is short for descending, and it flips it, so the biggest come first. If you ever get the right rows upside down, a missing DESC is almost always why.

          Then LIMIT 5 keeps just the top five. Sort, then cut off. Put together, that's a top-five list.

          One more thing that helps a lot: SQL words always come in the same order. SELECT, then FROM, then WHERE if you have one, then ORDER BY, then LIMIT. If you mix up that order, you'll get a syntax error.

          Click Run. Your top order should be a Travel Tumbler order of 40.
        `,
        lines: [
          ["ORDER BY quantity", "Sort the rows by the quantity column."],
          ["DESC", "Descending: biggest first. Without it, smallest comes first."],
          ["LIMIT 5", "Keep only the first five rows after sorting."]
        ],
        check: {
          q: "What would we get if we left off DESC?",
          a: "The five smallest orders instead of the five biggest, because ORDER BY sorts smallest first by default."
        },
        watch: [
          "Smallest orders show up: DESC is missing.",
          "Syntax error near LIMIT or ORDER: the words are in the wrong order. It's ORDER BY first, then LIMIT.",
          "ORDERBY written as one word gives an error. It's two words."
        ],
        recap: "\"Biggest\" or \"top\" means ORDER BY, with DESC for biggest first."
      },
      {
        minutes: 6,
        talk: T`
          Step four. We're being asked to work out revenue, quantity times price, for each order, and show the top 5. So here's what we'll do: multiply two columns, give the result a name, and sort by it. And here's why: quantity alone doesn't tell the whole story. Forty cheap mugs could bring in less money than ten expensive tumblers. What the business actually cares about is revenue.

          First, how do we know we have to calculate it? Check the columns. There's quantity, there's unit_price, but there's no revenue column. When the number you need isn't stored, you make it yourself, right inside the SELECT.

          Type: SELECT product, comma, quantity star unit_price AS revenue. In code, the star between two values means multiply. Yes, it's the same symbol as "every column" from step one. SQL knows the difference: on its own after SELECT, it means everything. Between two values, it means multiply.

          AS revenue gives our new column a name. This is called an alias. Without it, the column would literally be called "quantity * unit_price," which looks messy in a report. And there's a bonus: now that it has a name, we can sort by it.

          So the next lines are FROM sales, ORDER BY revenue DESC, LIMIT 5.

          Click Run. The top order should be that Travel Tumbler order again, at 960 dollars. Forty tumblers at 24 dollars each.
        `,
        lines: [
          ["quantity * unit_price", "Multiply the two columns for every row. Between two values, * means multiply."],
          ["AS revenue", "Name the new column revenue. A name like this is called an alias."],
          ["ORDER BY revenue DESC", "Sort by the new column, biggest first."],
          ["LIMIT 5", "Keep the top five."]
        ],
        check: {
          q: "The star appears in step one and in this step. What does it mean in each?",
          a: "In SELECT *, it means every column. Between two values, like quantity * unit_price, it means multiply."
        },
        watch: [
          "Column called \"quantity * unit_price\": they forgot AS revenue. The check will ask them to name it.",
          "\"no such column: revenue\" in ORDER BY: the AS is misspelled, or the alias is different.",
          "unitprice without the underscore gives \"no such column\"."
        ],
        recap: "If the number you need isn't stored, calculate it in SELECT and name it with AS."
      },
      {
        minutes: 5,
        talk: T`
          Step five. We're being asked for two headline numbers: how many orders there are, and the total revenue. So here's what we'll do: count the rows and add up the revenue, in one query. And here's why: every report, every dashboard, every monthly update starts with "how many, and how much."

          The question tells us exactly which tools to use. "How many" means counting, so COUNT. "Total" means adding, so SUM. Those two words will come up constantly in your career, and they map straight to those two.

          Type: SELECT, then on the next line, COUNT open bracket star close bracket AS total_orders, comma. Then SUM, and inside it the same revenue math as before, quantity star unit_price, AS total_revenue. Then FROM sales and a semicolon.

          COUNT star counts every row. Since every row in this table is one order, that's our number of orders.

          SUM adds things up, so SUM of quantity times unit_price adds up the revenue of every single order.

          Click Run, and notice something new. Every query so far gave us lots of rows. This one gives us one row. COUNT and SUM are called aggregate functions. Aggregate means "combine." They squash many rows into one answer.

          You should see 150 orders, and total revenue of about 8,351 dollars.
        `,
        lines: [
          ["COUNT(*)", "Count every row. Each row is one order."],
          ["AS total_orders", "Name that answer total_orders."],
          ["SUM(quantity * unit_price)", "Work out each order's revenue, then add them all up."],
          ["AS total_revenue", "Name that answer total_revenue."]
        ],
        check: {
          q: "Why does this query return only one row?",
          a: "COUNT and SUM are aggregate functions. They combine many rows into a single answer for the whole table."
        },
        watch: [
          "A comma is missing between the two lines in SELECT, which causes a syntax error.",
          "SUM(revenue) gives \"no such column\": the revenue alias only exists in the query where it was made. Write the math again.",
          "Missing AS names: the check will ask for total_orders and total_revenue."
        ],
        recap: "\"How many\" is COUNT. \"Total\" is SUM."
      },
      {
        minutes: 7,
        talk: T`
          Step six, and this one's the big one. We're being asked for total revenue for each region, highest first. So here's what we'll do: group the orders by region, add up revenue inside each group, and sort. And here's why: "which region is doing best?" is a classic question, and the tool we'll use, GROUP BY, is the most useful thing in SQL.

          Here's the signal. Listen for "for each" or "by." Revenue for each region. Sales by month. Orders per customer. Every time you hear that, it's GROUP BY. If you've ever made a pivot table in Excel, you already understand it.

          Picture this. GROUP BY region takes all 150 orders and sorts them into four piles: North, South, East and West. Then SUM adds up the revenue inside each pile separately. So instead of one total, we get four totals, one per region.

          Type: SELECT region, comma, SUM of quantity star unit_price AS revenue. FROM sales. GROUP BY region. ORDER BY revenue DESC. Semicolon.

          Here's a rule that will save you a lot of errors. Look at the SELECT line. Any column there that's not inside SUM or COUNT has to also be in GROUP BY. Here that's region. If you forget, the database doesn't know which pile you mean.

          Click Run. Which region came out on top?
        `,
        lines: [
          ["SELECT region, ...", "Show the region, plus a total for it."],
          ["SUM(quantity * unit_price) AS revenue", "Add up revenue, separately inside each group."],
          ["GROUP BY region", "Put the rows into piles, one pile per region."],
          ["ORDER BY revenue DESC", "Best region first."]
        ],
        check: {
          q: "Which region brought in the most revenue, and roughly how much?",
          a: "The South, with about 3,397 dollars. That's almost twice the next region, East, at about 1,824."
        },
        watch: [
          "One row instead of four: GROUP BY is missing.",
          "GROUP BY placed after ORDER BY causes a syntax error. GROUP BY comes first.",
          "Grouping by the wrong column, like product, gives many more rows."
        ],
        recap: "\"For each\" or \"by\" means GROUP BY."
      },
      {
        minutes: 6,
        talk: T`
          Step seven. We're being asked, for each category, how many units sold and how much revenue, rounded to 2 decimals, highest revenue first. So here's what we'll do: group by category, calculate two totals per group, round the money, and sort. And here's why: this tells the owner where to focus. What to restock, what to promote, what to drop.

          "For each category" is our GROUP BY signal again. And this time, the question asks for two numbers per group. That's fine. You can calculate as many totals per group as you want.

          Type: SELECT, then category, comma. Then SUM of quantity AS units_sold, comma. That's how many items sold. Then ROUND, open bracket, SUM of quantity star unit_price, comma, 2, close bracket, AS revenue. Then FROM sales, GROUP BY category, ORDER BY revenue DESC.

          ROUND takes two things: the number, and how many decimal places you want. 2 means two decimal places, like real money. Watch the brackets on that line, because there are two sets: one for SUM, and one around the whole thing for ROUND.

          Click Run. Now look closely, because there's a real insight here. Which category sold the most units? And which made the most money? They're not the same. Coffee sells the most items, but Merch makes the most money, because merch costs more per item. That's exactly the kind of thing a manager wants to know.
        `,
        lines: [
          ["category", "The column we're grouping by."],
          ["SUM(quantity) AS units_sold", "How many items sold in each category."],
          ["ROUND(..., 2)", "Round the number to 2 decimal places."],
          ["SUM(quantity * unit_price)", "Revenue for each category."],
          ["GROUP BY category", "One pile per category."]
        ],
        check: {
          q: "Coffee sold the most units. Why isn't it the top category by revenue?",
          a: "Merch items cost more each, so fewer sales bring in more money. Merch made about 3,285 dollars from 157 units. Coffee made about 2,968 from 220 units."
        },
        watch: [
          "Mismatched brackets on the ROUND line. It should end with ), 2) AS revenue.",
          "Missing comma between the three items in SELECT.",
          "Sorting by units_sold instead of revenue gives a different order. The question asks for revenue."
        ],
        recap: "You can calculate several totals per group, and they can tell different stories."
      },
      {
        minutes: 7,
        talk: T`
          Last step. We're being asked for total revenue for each month, from January to June. So here's what we'll do: turn each order's date into just its year and month, group by that, add up revenue, and sort by month. And here's why: "how are we trending?" is the question every owner asks, and this is the table you'd use to make a line chart.

          "For each month" is our GROUP BY signal. But there's a catch. Our dates include the day, like 2025-03-14. If we grouped by the full date, we'd get a separate pile for every single day. We want a pile per month.

          So we need just the year and month, 2025-03. The tool for that is strftime. It reformats a date. Inside it, '%Y-%m' is a pattern. %Y means the four-digit year, then a dash, then %m means the two-digit month. So strftime('%Y-%m', order_date) turns 2025-03-14 into 2025-03. We name that AS month.

          Type: SELECT, strftime, open bracket, '%Y-%m' in single quotes, comma, order_date, close bracket, AS month, comma. Then ROUND of SUM of quantity star unit_price, comma 2, AS revenue. FROM sales. GROUP BY month. ORDER BY month.

          Notice we can GROUP BY month, the name we just made with AS. And ORDER BY month sorts it January through June, oldest first, with no DESC.

          Click Run, and let's read the story together. January was the strongest month. It dipped through the spring, with May the lowest, then picked back up in June. That's a real insight, and it came from six lines of SQL.
        `,
        lines: [
          ["strftime('%Y-%m', order_date)", "Reformat each date to just year and month, like 2025-03."],
          ["%Y and %m", "Pattern codes: %Y is the year, %m is the month."],
          ["AS month", "Name the new column month."],
          ["GROUP BY month", "One pile per month."],
          ["ORDER BY month", "Oldest month first, January to June."]
        ],
        check: {
          q: "Why couldn't we just GROUP BY order_date?",
          a: "Each date includes the day, so we'd get a separate group for every day instead of every month."
        },
        watch: [
          "Double quotes around the pattern can fail in some databases. Use single quotes: '%Y-%m'.",
          "A lowercase y in the pattern gives the wrong result. It's a capital Y.",
          "Months out of order: ORDER BY month is missing, or it has DESC."
        ],
        recap: "To group by month, reformat the date to year and month first."
      }
    ],
    closing: {
      minutes: 5,
      talk: T`
        Let's look at what you just did. In one session, you answered eight real business questions. What's in the data. What's happening in just one region. Our biggest orders. Our biggest orders by money. Total orders and revenue. The best region. The best category. And how sales moved month to month.

        Every one of those is a question a real manager asks, and you can now answer them in a few lines of SQL.

        If you remember nothing else, remember the signals. "Only" means WHERE. "Biggest" or "top" means ORDER BY. "How many" is COUNT, "total" is SUM. And "for each" means GROUP BY. If you can hear those words in a question, you can write the query.

        Let's take some questions. Unmute or drop them in the chat.
      `,
      homework: [
        "Who's the best customer? Group by the customer column and add up revenue.",
        "Which product sold the most units in the South only? Combine WHERE and GROUP BY.",
        "Find all orders over 50 dollars. Hint: WHERE quantity * unit_price > 50."
      ],
      questions: [
        { q: "Do I have to write SQL words in capitals?", a: "No. SQL doesn't care. Capitals are a habit that makes queries easier to read." },
        { q: "Is SQL the same everywhere?", a: "The basics we used today, SELECT, WHERE, GROUP BY and ORDER BY, work almost everywhere. Some tools have small differences, especially with dates." },
        { q: "When would I use SQL instead of Python?", a: "Use SQL to pull and summarize data from a database. Use Python for cleaning, automating and everything after. Most data jobs use both." }
      ],
      next: "Next session is Skywatch, where we'll get our Python code to talk to a live weather service on the internet."
    }
  };

  /* ================================================================
     SESSION 3 · Skywatch · Pull Data from an API
     ================================================================ */
  CLASS["weather-api"] = {
    session: 3,
    opening: {
      minutes: 6,
      talk: T`
        Hi everyone, welcome to Python for Beginners. Today is one of my favorite sessions, because we're going to get our code to talk to another computer on the internet and bring back live data. If you're new, no worries at all. Everything we need, I'll explain as we go.

        Today's project is called Skywatch. Picture a weather station on the night shift. Your team wants a weather snapshot for six cities every day. You could check a website six times, every morning, forever. Or you could write a script that asks a weather service for the data and saves a report. That's what we're building.

        The key word today is API. It stands for Application Programming Interface, but here's the simple version. A website is made for people to look at. An API is made for programs to ask questions. Your code sends a request, like "what's the weather in Chicago right now?", and the API sends back an answer as data.

        This is everywhere in real jobs. Online stores use APIs to check shipping prices. Finance teams pull exchange rates. Marketing teams pull numbers from social media. If you can call an API, you can automate tasks people do by hand every single day.

        We're using a free weather service called Open-Meteo. It doesn't need a password, a sign-up, or a credit card. And if the internet hiccups during class, horizon.dev quietly switches to practice weather data, so nobody gets stuck. You'll see a small "Practice data" tag if that happens.

        Let's get set up. Open horizon.dev and click Skywatch. On the left, you'll see weather_report.py, where we'll write, and cities.csv, our list of cities. Click cities.csv for a second. It has a city name, a latitude and a longitude on each line. Latitude and longitude are just a location's address on a map, as two numbers. Drop a 1 in the chat when you can see that file, and we'll start.
      `,
      setup: [
        "horizon.dev is open, and Skywatch is selected",
        "They can see weather_report.py and cities.csv on the left",
        "They've opened cities.csv and seen city, lat and lon",
        "Everyone has dropped a 1 in the chat"
      ]
    },
    steps: [
      {
        minutes: 8,
        talk: T`
          Step one. We're being asked to ask the weather service for New York's current temperature and wind, and check that it answered. So here's what we'll do: write down the address, write down the details we want, send the request, and print the status code. And here's why: this is the moment your code talks to another computer for the first time. Let's do it carefully.

          First line: import requests. requests is the most popular Python tool for talking to websites and APIs. It's already set up for you here.

          Next, url equals, and the address in quotes. The url is where the weather service lives, like a phone number we're calling. How do we know this address, and the words coming up next? From the API's documentation, which is its instruction manual. Open-Meteo's manual tells you the address and exactly which details to send. In a real job, reading the docs is always step one with a new API.

          Now params. Look at the curly brackets. That's a dictionary. A dictionary is a list of labels and values, like filling out a form. Each line is a label in quotes, a colon, then the value. Latitude 40.71 and longitude -74.01 is New York. current says which live values we want, temperature and wind speed. And the last two pick Fahrenheit and miles per hour. Notice the comma at the end of each line.

          Then response equals requests.get, with the url and params. get means "go fetch." The answer comes back and goes into response.

          Last line: print(response.status_code). Every answer from the internet comes with a status code. 200 means OK. You've probably seen 404 before, which means not found.

          Click Run. Did everyone get 200?
        `,
        lines: [
          ["import requests", "Bring in the requests tool for talking to websites."],
          ["url = \"https://...\"", "The address of the weather service, from its documentation."],
          ["params = { ... }", "A dictionary of details to send: labels on the left, values on the right."],
          ["\"latitude\": 40.71", "One label and its value. Latitude and longitude give New York's location."],
          ["\"current\": \"temperature_2m,wind_speed_10m\"", "Which live values we want back, using the names from the documentation."],
          ["requests.get(url, params=params)", "Send the request to the address with our details, and wait for the answer."],
          ["response.status_code", "The answer's status: 200 means OK."]
        ],
        check: {
          q: "What does a status code of 200 mean? And what about 404?",
          a: "200 means OK, the request worked. 404 means not found, usually because the address is wrong."
        },
        watch: [
          "404: the url is misspelled. Compare it carefully with the code block.",
          "SyntaxError inside params: a missing comma at the end of a line, or a missing quote around a label.",
          "Curly brackets matter: params uses { }, not ( ) or [ ]."
        ],
        recap: "An API call is an address, some details, a request, and a status code to check."
      },
      {
        minutes: 5,
        talk: T`
          Step two. We're being asked to turn the API's answer into something Python can read, and look at it. So here's what we'll do: convert the response into a Python dictionary and print the whole thing. And here's why: we can't pull out the temperature until we know where it lives in the answer.

          APIs almost always send their answers in a format called JSON. JSON is just text, organized with labels and values. It looks a lot like the dictionary we wrote for params.

          Type: data equals response.json(). That turns the JSON text into a Python dictionary, which we store in data. Then print(data).

          Click Run, and let's read the output together, slowly, because this is a skill you'll use all the time. You'll see curly brackets, and labels like latitude and longitude. Then there's a label called current_units, and then one called current. Inside current, there are more labels: time, temperature_2m, and wind_speed_10m.

          So we have a dictionary inside a dictionary. That's called nested. Think of folders inside folders. The number we want, the temperature, is in the current folder, labeled temperature_2m.

          Why print the whole thing first? Because every API shapes its answer differently. You always look at the shape before you try to grab something out of it.
        `,
        lines: [
          ["response.json()", "Turn the API's JSON answer into a Python dictionary."],
          ["data = ...", "Store that dictionary in a variable called data."],
          ["print(data)", "Show the whole answer, so we can see its shape."]
        ],
        check: {
          q: "In the printout, where is the temperature? Describe the path.",
          a: "Inside the \"current\" section, under the label \"temperature_2m\". It's a dictionary inside a dictionary."
        },
        watch: [
          "Printing <bound method...>: they wrote response.json without parentheses.",
          "No \"current\" section in the output: the current line in params from step 1 is missing or misspelled.",
          "The output is long and wraps across lines. That's normal. Point them to the word current."
        ],
        recap: "Always print an API's answer first, so you know its shape."
      },
      {
        minutes: 6,
        talk: T`
          Step three. We're being asked to pull out the temperature and wind speed, and print them as a sentence. So here's what we'll do: reach into the data to grab each number, store each one in a variable, and print a sentence. And here's why: raw data is for computers. A clear sentence is for people.

          To get a value out of a dictionary, you use square brackets with the label in quotes. So data square bracket "current" opens the current folder. Then we add a second set of square brackets, "temperature_2m", to grab the temperature inside it. Two folders, two sets of brackets.

          Type: temp equals data["current"]["temperature_2m"]. Then wind equals data["current"]["wind_speed_10m"].

          Where do those labels come from? Copy them exactly from the printout in step two. Never guess. If you type temperature instead of temperature_2m, you'll get a KeyError, which means "I can't find that label."

          Now the sentence. print, open bracket, then a lowercase f right before the quotes. That f makes it an f-string. An f-string lets you drop variables straight into a sentence using curly brackets. So inside the quotes we write: New York, colon, {temp}, the degree sign and F, comma, wind {wind} mph.

          When Python prints it, {temp} gets swapped for the real temperature. Click Run. Your numbers will be different from mine, because this is live weather, right now.
        `,
        lines: [
          ["data[\"current\"]", "Open the current section of the answer."],
          ["[\"temperature_2m\"]", "Then grab the temperature inside it."],
          ["temp = ...", "Store the temperature in a variable called temp."],
          ["f\"...\"", "An f-string: a sentence that can include variables."],
          ["{temp}", "Inside an f-string, curly brackets drop in a variable's value."]
        ],
        check: {
          q: "What does the little f before the quotes do?",
          a: "It makes an f-string, so anything in curly brackets, like {temp}, is replaced with that variable's value."
        },
        watch: [
          "KeyError: 'temperature': the label must be exactly temperature_2m, copied from the printout.",
          "The sentence prints {temp} literally: the f before the quotes is missing.",
          "Quotes inside the brackets: data[\"current\"], not data[current]."
        ],
        recap: "Use square brackets with labels to dig into nested data."
      },
      {
        minutes: 8,
        talk: T`
          Step four. We're being asked to wrap our request in a reusable function that works for any city. So here's what we'll do: write a function called get_weather that takes a latitude and longitude, and hands back the current weather. And here's why: we need six cities. We could copy and paste our request code six times, but then if we ever want to change one thing, we'd have to change it in six places.

          A function is a reusable recipe. You write the steps once, give them a name, and then use that name whenever you want. Whenever you'll do the same steps more than once with different inputs, that's your sign to write a function.

          Type: def get_weather, open bracket, lat, comma, lon, close bracket, colon. def means "define a new function." get_weather is the name we chose. lat and lon are the inputs, also called parameters. They're the parts that change each time. And that colon at the end matters.

          Now every line inside the function is indented, pushed in by four spaces. Indentation is how Python knows which lines belong to the function. Inside, it's the same params dictionary as before, but instead of 40.71, we use lat, and instead of -74.01, lon.

          Then the request, same as before. Then response.raise_for_status(). That's a safety check. If the API ever sends back an error, the script stops and tells us, instead of quietly carrying on with bad data.

          Last line inside: return response.json(), square bracket "current". return hands the answer back to whoever used the function.

          Then, not indented, we test it: print(get_weather(41.88, -87.63)). That's Chicago. Click Run.
        `,
        lines: [
          ["def get_weather(lat, lon):", "Define a function named get_weather with two inputs. The colon starts the function."],
          ["(indented lines)", "Everything indented under def is part of the function."],
          ["\"latitude\": lat", "Use the input instead of a fixed number, so it works for any city."],
          ["response.raise_for_status()", "Stop with an error if the API answered with a problem."],
          ["return response.json()[\"current\"]", "Hand back just the current weather."],
          ["get_weather(41.88, -87.63)", "Use the function with Chicago's location."]
        ],
        check: {
          q: "What are lat and lon inside the function?",
          a: "They're the function's inputs, called parameters. Each time we use the function, we give it a different latitude and longitude."
        },
        watch: [
          "IndentationError: lines inside the function aren't indented, or the spacing is uneven. Use four spaces.",
          "Missing colon after def get_weather(lat, lon) gives a SyntaxError.",
          "The function prints None: they forgot the return line."
        ],
        recap: "Write a function when you'll repeat the same steps with different inputs."
      },
      {
        minutes: 8,
        talk: T`
          Step five. We're being asked to get the weather for every city in cities.csv, and collect the results. So here's what we'll do: open the file, loop through each row, call our function, and add each result to a list. And here's why: this is automation. Six cities, six requests, and we only write the code once. It would work just the same for 600.

          The word "every" is our signal. "For every city, do this." In Python, that's a for loop.

          First, import csv. That's Python's built-in tool for reading CSV files.

          Then results equals empty square brackets. That's an empty list, an empty box we'll fill as we go.

          Next: with open("cities.csv") as f, colon. with open opens the file, and closes it for us automatically when we're done. f is just a short name for the open file.

          Indented inside that: for row in csv.DictReader(f), colon. DictReader reads the file one row at a time, and gives us each row as a dictionary. That's why we can say row["city"], row["lat"] and row["lon"]. Those names come from the first line of cities.csv.

          Indented again, inside the loop: current equals get_weather of row lat and row lon. Then results.append, and a small dictionary with three labels: city, temp_f and wind_mph. append means "add to the end of the list." Then a print line so we can watch it work.

          Indentation is doing a lot here, so check yours. Click Run, and watch six cities come in.
        `,
        lines: [
          ["import csv", "Bring in Python's built-in tool for CSV files."],
          ["results = []", "Start an empty list to collect the answers."],
          ["with open(\"cities.csv\") as f:", "Open the file. It closes automatically when the indented block ends."],
          ["for row in csv.DictReader(f):", "Loop: run the indented lines once for each row, with labels from the header."],
          ["get_weather(row[\"lat\"], row[\"lon\"])", "Use our function with this row's location."],
          ["results.append({ ... })", "Add a small dictionary for this city to the end of the list."]
        ],
        check: {
          q: "If we added a seventh city to cities.csv, how much code would we need to change?",
          a: "None. The loop runs once for every row, so it would pick up the new city automatically."
        },
        watch: [
          "Only one city in results: the append line isn't indented inside the for loop.",
          "KeyError: 'latitude': the column names in cities.csv are lat and lon, not latitude and longitude.",
          "NameError: get_weather is not defined: the function from step 4 was deleted or is below this code."
        ],
        recap: "\"For every\" means a for loop. Collect results with a list and append."
      },
      {
        minutes: 5,
        talk: T`
          Step six. We're being asked to find which city is warmest right now. So here's what we'll do: use max to find the result with the highest temperature, and print it. And here's why: data is only useful when it answers a question.

          Warmest means highest temperature, and max finds the biggest item. With a list of plain numbers, max is easy. But our results are dictionaries, like a city, a temperature and a wind speed. Python can't tell what "the biggest dictionary" means. So we have to tell max what to compare. That's what key is for.

          Type: warmest equals max, open bracket, results, comma, key equals lambda r colon r["temp_f"], close bracket.

          The lambda part looks scary, but it's just a tiny, one-line function with no name. Read it like this: for each result r, look at its temp_f. So max compares the temperatures, and gives back the whole dictionary for the warmest city.

          Then print an f-string: Warmest right now, colon, then warmest square bracket 'city', at, warmest square bracket 'temp_f', degrees F. Notice I used single quotes inside the curly brackets. The whole f-string uses double quotes, and older versions of Python don't allow the same kind of quote inside. Switching to single quotes inside is the safe habit, and it works everywhere.

          Click Run. Which city is warmest for you right now?
        `,
        lines: [
          ["max(results, ...)", "Find the biggest item in the results list."],
          ["key=lambda r: r[\"temp_f\"]", "Compare by each result's temp_f. lambda is a tiny one-line function."],
          ["warmest = ...", "Store the whole winning dictionary."],
          ["warmest['city']", "Its city name. Single quotes inside, because the f-string itself uses double quotes."]
        ],
        check: {
          q: "Why can't we just write max(results) without key?",
          a: "Each result is a dictionary with several values. Python doesn't know which one to compare, so key tells it to compare temp_f."
        },
        watch: [
          "Quotes in the print line: if they copy this into an older Python on their own computer, double quotes inside a double-quoted f-string cause a SyntaxError. Single quotes inside always work.",
          "The coldest city shows up: they used min instead of max.",
          "TypeError about comparing dicts: key= is missing."
        ],
        recap: "max finds the biggest item. key tells it what to compare."
      },
      {
        minutes: 6,
        talk: T`
          Last step. We're being asked to save the results as a file called weather_report.csv. So here's what we'll do: create a new CSV file, write the column names, then write a row for every city. And here's why: a printout disappears when you close the window. A saved file can be emailed, opened in Excel, or loaded into a dashboard.

          Type: with open, then "weather_report.csv", comma, "w", comma, newline equals empty quotes, close bracket, as f, colon.

          The "w" means we're opening the file to write. Without it, Python opens files to read. newline equals empty quotes is a small fix that stops Windows from adding blank lines between rows. You don't need to understand it deeply, just include it when you write a CSV.

          Indented inside: writer equals csv.DictWriter, f, comma, fieldnames equals a list of our three column names. We read the cities with DictReader. Our results are dictionaries too, so the partner tool for writing is DictWriter. fieldnames tells it the columns, in order.

          Then writer.writeheader(), which writes the column names as the first row. And writer.writerows(results), which writes every dictionary in our list as a row.

          Then, not indented, a print to confirm.

          Click Run. weather_report.csv appears on the left. Click it. That's a live weather report, built by your own script. In a real job, you could schedule this to run every morning at 7 a.m., and nobody would ever have to look up the weather by hand again.
        `,
        lines: [
          ["open(\"weather_report.csv\", \"w\", newline=\"\")", "Create a file to write to. newline=\"\" stops blank lines on Windows."],
          ["csv.DictWriter(f, fieldnames=[...])", "A writer that turns dictionaries into CSV rows, with these columns in this order."],
          ["writer.writeheader()", "Write the column names as the first row."],
          ["writer.writerows(results)", "Write one row for every dictionary in the list."]
        ],
        check: {
          q: "What's the difference between opening a file with \"w\" and opening it with no mode?",
          a: "\"w\" opens it for writing, creating the file if needed. With no mode, Python opens it for reading."
        },
        watch: [
          "No header row in the file: writer.writeheader() is missing.",
          "ValueError about fields not in fieldnames: the labels in results don't match fieldnames exactly.",
          "Empty file: writerows is outside the with block. It must be indented inside."
        ],
        recap: "To save a list of dictionaries as a CSV, use DictWriter with \"w\"."
      }
    ],
    closing: {
      minutes: 5,
      talk: T`
        Let's recap what we built today. Our script talks to a weather service on the internet, gets live data for six cities, figures out which one is warmest, and saves a report. That's about forty lines of code.

        But the bigger win is the pattern. Send a request. Check the status. Read the JSON. Pull out what you need. Loop. Save. That's the same pattern for almost every API out there. Swap the weather service for a shipping service, a stock price service or a sports scores service, and you follow the exact same steps.

        Along the way, you also learned some of the most important building blocks in all of Python: dictionaries, functions, for loops and lists. Those show up in nearly every program you'll ever write.

        Let's open it up for questions. Unmute or drop them in the chat.
      `,
      homework: [
        "Add your own city to cities.csv. Look up its latitude and longitude, add a line, and run the script again.",
        "Find the windiest city as well. Hint: copy the max line and compare wind_mph.",
        "Add a third value to the report, like precipitation. Check Open-Meteo's documentation for its name."
      ],
      questions: [
        { q: "Are all APIs free like this one?", a: "Many are free with limits. Some need a key, which is like a password you get when you sign up. The steps are the same, you just send the key with your request." },
        { q: "What's the difference between a dictionary and a list?", a: "A list keeps things in order, and you get them by position, like results[0]. A dictionary keeps labels and values, and you get them by label, like data[\"current\"]." },
        { q: "Why indent with four spaces?", a: "Python uses indentation to know which lines belong inside a function, loop or with block. Four spaces is the standard everyone uses." }
      ],
      next: "Next session is Double Take, where we'll hunt down duplicate sign-ups hiding in an event list."
    }
  };

  /* ================================================================
     SESSION 4 · Double Take · Find Duplicate Records
     ================================================================ */
  CLASS["duplicates"] = {
    session: 4,
    opening: {
      minutes: 5,
      talk: T`
        Hi everyone, welcome to Python for Beginners. If you're joining for the first time, you're in a great spot, because today we're using plain Python, no extra tools. You'll learn the core building blocks everything else is made of.

        Today's project is called Double Take. We're at a theater box office. The events team ran sign-ups for two workshops, and something's off. Their list says 37 people are coming, but some people clicked submit twice. And some signed up again a week later and typed their email a little differently, with a capital letter or an extra space. So how many real people are actually coming?

        This is a problem every business has. Duplicates in a customer list mean double emails, wrong headcounts, and too much food ordered for the event. In real jobs, this shows up in sales systems, mailing lists and sign-up sheets. Being the person who can clean it up is genuinely valuable.

        Today you'll learn three building blocks: lists, sets and dictionaries. And you'll learn a trick professionals use all the time: clean the data first, then compare.

        Let's get set up. Open horizon.dev and click Double Take. On the left you'll see find_duplicates.py, where we'll write, and signups.csv, the sign-up list. Click signups.csv and scroll through it. See if you can spot a duplicate with your own eyes. It's harder than you'd think, and that's exactly why we write code for it. Drop a 1 in the chat when you're ready.
      `,
      setup: [
        "horizon.dev is open, and Double Take is selected",
        "They can see find_duplicates.py and signups.csv on the left",
        "They've scrolled through signups.csv",
        "Everyone has dropped a 1 in the chat"
      ]
    },
    steps: [
      {
        minutes: 6,
        talk: T`
          Step one. We're being asked to read signups.csv and count how many sign-ups there are. So here's what we'll do: open the file, read every row into a list, then print the count and the first row. And here's why: before we can compare sign-ups, every one of them needs to be inside Python.

          First line: import csv. That brings in Python's built-in tool for reading CSV files. Built-in means it comes with Python, nothing extra to install.

          Next: with open("signups.csv") as f, colon. with open opens the file, and the with part closes it automatically when we're done. f is just a short name for the open file.

          Indented inside: rows equals list, open bracket, csv.DictReader(f), close bracket. DictReader reads the file one row at a time, and turns each row into a dictionary. A dictionary is labels and values, so each row has labels like name, email, phone, event and signup_date. Wrapping it in list puts every row into one list called rows. A list is just things in order, inside square brackets.

          Then, not indented: print(len(rows), "sign-ups"). len is short for length. It counts how many things are in the list.

          And print(rows[0]). The square brackets with a number pick one item by its position. And here's the thing that trips up everyone: Python starts counting at zero, not one. So rows[0] is the first row.

          Click Run. You should see 37 sign-ups, and then the first person, shown as a dictionary.
        `,
        lines: [
          ["import csv", "Bring in Python's built-in CSV tool."],
          ["with open(\"signups.csv\") as f:", "Open the file. It closes automatically after the indented block."],
          ["csv.DictReader(f)", "Read each row as a dictionary, using the header row as labels."],
          ["rows = list(...)", "Put every row into one list called rows."],
          ["len(rows)", "How many items are in the list."],
          ["rows[0]", "The first item. Python counts from 0."]
        ],
        check: {
          q: "If rows[0] is the first sign-up, how would you get the second one?",
          a: "rows[1]. Python counts positions from 0, so the second item is at position 1."
        },
        watch: [
          "Indentation: the rows = line must be indented inside the with block.",
          "IndexError: list index out of range: they wrote rows[37] or higher. The last item is rows[36].",
          "FileNotFoundError: the file name must be exactly signups.csv."
        ],
        recap: "Read the file into a list, count it, and look at one row."
      },
      {
        minutes: 8,
        talk: T`
          Step two. We're being asked to find rows that are exact copies of an earlier row. So here's what we'll do: go through every sign-up, remember each one we've seen, and collect any we've seen before. And here's why: exact copies are the easiest duplicates to catch. Someone clicked submit twice. Let's start there.

          The question we keep asking is "have I seen this before?" Python has a tool built for exactly that question, called a set. A set is like a list, but it's incredibly fast at answering "is this already in here?" It also never holds the same thing twice.

          Type: seen equals set(), with empty brackets. That's an empty set. Then exact_dupes equals empty square brackets, an empty list where we'll collect the copies.

          Now the loop: for row in rows, colon. That runs the indented lines once for every sign-up.

          Indented: key equals tuple, open bracket, row.values(), close bracket. row.values() gives us everything in the row: the name, email, phone and so on. tuple packs them into one fixed value. Think of it as taking a fingerprint of the whole row. We need this step because a set can't hold a dictionary directly.

          Then: if key in seen, colon. If we've seen this exact fingerprint before, it's a duplicate, so indented under it, exact_dupes.append(row).

          Then else, colon. Otherwise, it's new, so seen.add(key). We remember it for next time.

          Finally, not indented, print how many we found. Click Run. You should see 4 exact duplicates.
        `,
        lines: [
          ["seen = set()", "An empty set, to remember every row we've seen."],
          ["exact_dupes = []", "An empty list, to collect the copies."],
          ["for row in rows:", "Run the indented lines once for each sign-up."],
          ["tuple(row.values())", "Pack all of the row's values into one fixed value, a fingerprint a set can hold."],
          ["if key in seen:", "Have we seen this exact row before?"],
          ["exact_dupes.append(row)", "If yes, it's a duplicate, so add it to the list."],
          ["else: seen.add(key)", "If no, remember it for next time."]
        ],
        check: {
          q: "What's the one question a set is really good at answering?",
          a: "\"Is this already in here?\" A set answers that instantly, even with millions of items."
        },
        watch: [
          "37 duplicates: they wrote seen.add(key) before the if, so every row looks already seen. The add belongs in the else.",
          "The else lines up with the if, not with the lines under it. Indentation errors are common here.",
          "TypeError: unhashable type: 'dict': they put the row in the set directly. Use the tuple key."
        ],
        recap: "A set remembers what you've seen. if ... in ... checks it."
      },
      {
        minutes: 5,
        talk: T`
          Step three. We're being asked to write a small function that cleans up an email before we compare it. So here's what we'll do: remove the extra spaces, make it lowercase, and hand back the clean version. And here's why: the exact-duplicate check only catches perfect copies. Some people signed up twice but typed their email a little differently. To a computer, "Tom.Becker@Example.com" and "tom.becker@example.com" are two different people.

          So what's different about them? Spaces and capital letters. strip removes spaces at the start and end. lower makes everything lowercase. Cleaning values so they can be compared fairly has a name. It's called normalizing.

          Why put it in a function? We're going to clean every email in the list, in more than one step. A function is a reusable recipe. We write it once, give it a name, and it does the exact same thing every time.

          Type: def clean_email, open bracket, email, close bracket, colon. def means define a function. clean_email is the name. email in the brackets is the input.

          Indented: return email.strip().lower(). return hands the cleaned email back to whoever asked.

          Then, not indented, we test it on one messy email: print(clean_email(" Maya.R@Email.com ")), with spaces inside the quotes on purpose.

          Click Run. You should see maya.r@email.com, all lowercase, no spaces. Testing a small piece before you use it everywhere is a habit that will save you hours.
        `,
        lines: [
          ["def clean_email(email):", "Define a function named clean_email that takes one input."],
          ["email.strip()", "Remove spaces at the start and end."],
          [".lower()", "Make it all lowercase."],
          ["return ...", "Hand the cleaned email back."],
          ["clean_email(\"  Maya.R@Email.com \")", "Test the function on one messy example."]
        ],
        check: {
          q: "Why would \"Tom.Becker@Example.com \" and \"tom.becker@example.com\" not match without cleaning?",
          a: "Computers compare text exactly. Capital letters and a trailing space make them different, even though they're the same person."
        },
        watch: [
          "The function prints None: return is missing.",
          "IndentationError: the return line must be indented under def.",
          "Using .strip without parentheses returns a method instead of text. It's .strip()."
        ],
        recap: "Clean values the same way before you compare them."
      },
      {
        minutes: 8,
        talk: T`
          Step four. We're being asked to count how many times each person signed up, and list the people who appear more than once. So here's what we'll do: tally every cleaned email in a dictionary, then pull out the ones with a count over one. And here's why: counting by the cleaned email catches every duplicate, including the hidden ones.

          "How many times each" is a tally. And a dictionary makes a perfect tally sheet. Each email is a label, and its value is how many times we've seen it.

          Type: counts equals empty curly brackets. That's an empty dictionary.

          Then the loop: for row in rows, colon. Indented: email equals clean_email(row["email"]). We grab this row's email and clean it with our new function.

          Next line is the tally: counts[email] equals counts.get(email, 0) plus 1. Let's read it carefully. counts.get(email, 0) means "look up this email's count, and if it's not there yet, use zero." Then we add one, and save it back under that email. So the first time we see someone, they go from zero to one. The second time, one to two.

          Then, not indented, this line: dupe_emails equals, square bracket, email for email comma n in counts.items() if n greater than 1, square bracket. This is called a list comprehension. Read it as a sentence: give me each email, for every email and count in our tally, if the count is more than one. counts.items() gives us each label and value as a pair.

          Click Run. We've gone from 4 exact duplicates to 8 people who signed up more than once. The cleaning found the hidden ones.
        `,
        lines: [
          ["counts = {}", "An empty dictionary, to use as a tally sheet."],
          ["email = clean_email(row[\"email\"])", "Get this row's email and clean it."],
          ["counts.get(email, 0)", "This email's current count, or 0 if it's new."],
          ["counts[email] = ... + 1", "Add one to the count and save it under that email."],
          ["counts.items()", "Every email and its count, as pairs."],
          ["[email for email, n in ... if n > 1]", "A list comprehension: keep each email whose count is more than one."]
        ],
        check: {
          q: "We found 4 exact duplicates before, and now 8 people who signed up more than once. Where did the extra people come from?",
          a: "They're hidden duplicates: the same person with a differently typed email. Cleaning the emails made them match."
        },
        watch: [
          "Only 4 people found: they used row[\"email\"] without clean_email, so hidden duplicates don't match.",
          "KeyError on counts[email] + 1: they wrote counts[email] + 1 instead of counts.get(email, 0) + 1. A new email isn't in the dictionary yet.",
          "The list comprehension needs both email and n after for: for email, n in counts.items()."
        ],
        recap: "A dictionary is a tally sheet: label, then count."
      },
      {
        minutes: 6,
        talk: T`
          Step five. We're being asked to build a clean list with just one sign-up per person. So here's what we'll do: go through every row and keep it only if we haven't kept that person yet. Then compare before and after. And here's why: now we know who's duplicated, this builds the list the events team actually needs.

          If this feels familiar, good, it should. It's the same pattern as step two, on purpose. A set remembers who we've already kept. The only difference is what we compare. Instead of the whole row, we compare the cleaned email. That way the hidden duplicates match too.

          Type: unique_rows equals empty square brackets. kept equals set().

          Then for row in rows, colon. Indented: email equals clean_email(row["email"]).

          Then: if email not in kept, colon. "not in" is the opposite of "in." It means "we haven't seen this person yet." Indented under it, two lines: kept.add(email), to remember them, and unique_rows.append(row), to keep their sign-up.

          If we have seen them, nothing happens, and we skip them. That means we always keep each person's first sign-up.

          Finally, not indented: print(len(rows), "sign-ups ->", len(unique_rows), "real people").

          Click Run. 37 sign-ups, but only 28 real people. Nine extra sign-ups. That's food, name tags and emails for nine people who don't exist.
        `,
        lines: [
          ["unique_rows = []", "An empty list for the clean sign-ups."],
          ["kept = set()", "A set of emails we've already kept."],
          ["if email not in kept:", "Only continue if we haven't kept this person yet."],
          ["kept.add(email)", "Remember this person."],
          ["unique_rows.append(row)", "Keep their first sign-up."]
        ],
        check: {
          q: "Which sign-up do we keep for someone who signed up three times: the first, the last, or all of them?",
          a: "The first. Once their email is in kept, every later sign-up from them is skipped."
        },
        watch: [
          "37 people kept: they forgot kept.add(email), so nobody is ever marked as kept.",
          "Wrong count: they compared row[\"email\"] instead of the cleaned email.",
          "Both lines under the if must be indented the same amount."
        ],
        recap: "Keep the first of each, compared on a cleaned value."
      },
      {
        minutes: 6,
        talk: T`
          Step six. We're being asked to save a report listing each duplicated email and how many times it signed up. So here's what we'll do: create a new CSV file, write a header row, then one row for each duplicated email. And here's why: good data work is checkable work. Your team shouldn't have to just trust you. They should be able to see exactly what you found.

          Type: with open, "duplicates_report.csv", comma, "w", comma, newline equals empty quotes, close bracket, as f, colon. The "w" means open it to write. newline equals empty quotes stops Windows from adding blank lines between rows.

          Indented: writer equals csv.writer(f). csv.writer writes simple lists as rows.

          Then writer.writerow, and a list with our two column names: "email" and "times_signed_up". That's the header.

          Then the loop, still indented: for email in dupe_emails, colon. Indented again: writer.writerow, and a list with the email, and counts square bracket email. That looks up this email's count in our tally from step four.

          Then, not indented, print a confirmation.

          Click Run, then open duplicates_report.csv on the left. Look at Priya. She signed up three times. Without this script, nobody would have noticed.
        `,
        lines: [
          ["open(\"duplicates_report.csv\", \"w\", newline=\"\")", "Create a new file to write."],
          ["csv.writer(f)", "A writer that turns lists into CSV rows."],
          ["writer.writerow([\"email\", \"times_signed_up\"])", "Write the header row."],
          ["for email in dupe_emails:", "One row for each duplicated email."],
          ["counts[email]", "Look up how many times this email signed up."]
        ],
        check: {
          q: "Where does the number in each row come from?",
          a: "From the counts dictionary we built in step four. counts[email] looks up that person's tally."
        },
        watch: [
          "Empty report: the for loop isn't indented inside the with block.",
          "Two writerow calls need square brackets around their values: writerow([email, counts[email]]).",
          "NameError: dupe_emails or counts not defined: step four's code is missing above."
        ],
        recap: "Save your findings so others can check your work."
      },
      {
        minutes: 5,
        talk: T`
          Last step. We're being asked to save the clean list as signups_clean.csv, with the same columns as the original. So here's what we'll do: write our unique rows to a new file, borrowing the column names from the original. And here's why: this is the deliverable. A clean list, ready for name tags, emails and an accurate headcount.

          Our rows are dictionaries, because DictReader gave them to us that way. So the partner tool for writing is DictWriter.

          Type: with open, "signups_clean.csv", "w", newline equals empty quotes, as f, colon. Indented: writer equals csv.DictWriter, f, comma, fieldnames equals rows[0].keys().

          Let's look at that last part. We need the column names, and we want them to match the original exactly. So we borrow them from the first row. keys() gives you a dictionary's labels. So rows[0].keys() is name, email, phone, event and signup_date, in the same order as the original file.

          Then writer.writeheader(), which writes the column names. And writer.writerows(unique_rows), which writes all 28 people.

          And like always, a brand-new file. The original stays untouched as a backup.

          Click Run. signups_clean.csv appears on the left. 28 real people, zero duplicates.
        `,
        lines: [
          ["csv.DictWriter(f, fieldnames=...)", "A writer that turns dictionaries into CSV rows."],
          ["rows[0].keys()", "The labels from the first row, so the columns match the original."],
          ["writer.writeheader()", "Write the column names."],
          ["writer.writerows(unique_rows)", "Write every unique person."]
        ],
        check: {
          q: "Why use rows[0].keys() instead of typing the column names ourselves?",
          a: "It copies them exactly from the original file, in the same order, with no chance of a typo."
        },
        watch: [
          "37 people in the file: they wrote rows instead of unique_rows.",
          "No header row: writer.writeheader() is missing.",
          "csv.writer instead of csv.DictWriter gives a TypeError, because the rows are dictionaries."
        ],
        recap: "Rows that are dictionaries get written with DictWriter."
      }
    ],
    closing: {
      minutes: 5,
      talk: T`
        Let's recap. We started with 37 sign-ups and found out there are really only 28 people. Four people clicked submit twice. And five more were hiding behind emails typed a little differently.

        The big lesson works far beyond sign-up forms: clean first, then compare. Customers, products, addresses, it doesn't matter. Normalize the values, and the duplicates show themselves.

        And look at the building blocks you used today: lists to keep things in order, sets to remember what you've seen, dictionaries to tally and look things up, a function to clean values, and for loops to do it all for every row. Honestly, those five things are the core of Python. You'll use them in almost every program you ever write.

        Let's take your questions. Unmute or drop them in the chat.
      `,
      homework: [
        "Match on phone number instead of email. Do you find the same people?",
        "Count how many real people signed up for each event. Hint: tally row[\"event\"] using unique_rows.",
        "Change step five to keep each person's last sign-up instead of their first."
      ],
      questions: [
        { q: "When do I use a list, a set or a dictionary?", a: "A list when order matters. A set when you need to check \"have I seen this?\" A dictionary when you need to look something up by a label, like an email to its count." },
        { q: "What if two different people share an email?", a: "Then email isn't a good way to match. You'd combine fields, like name plus phone. Choosing what makes a record unique is a real decision in data work." },
        { q: "Could I do this with pandas instead?", a: "Yes, pandas has drop_duplicates. Doing it by hand first means you understand what that one line is actually doing." }
      ],
      next: "Next session is Paws & Keys, where we'll design a real database from scratch for a vet clinic."
    }
  };

  /* ================================================================
     SESSION 5 · Paws & Keys · Build a Relational Database
     ================================================================ */
  CLASS["relational-db"] = {
    session: 5,
    opening: {
      minutes: 6,
      talk: T`
        Hi everyone, welcome to Python for Beginners. Today we're going behind the scenes of almost every app you use. Your bank, your favorite online store, the app you order food from. They all store their data the way we're going to build today. If you're new, don't worry. We're starting from an empty file.

        Today's project is called Paws & Keys. We're in the records room of a neighborhood vet clinic. Right now they keep everything in one giant spreadsheet: owners, pets and visits, all mixed together. Every time Maya brings her dog in, someone types her name and phone number again. If her number changes, they have to fix it in twenty places, and they'll miss some.

        A relational database fixes that. Each kind of thing gets its own table. Owners get a table. Pets get a table. Visits get a table. And the tables point to each other using ID numbers. Maya's phone number lives in exactly one place.

        Why this matters for your career: understanding how tables connect, and how to pull them back together, is what lets you work with real company databases. When someone in an interview says "primary key," "foreign key" or "JOIN," you'll have actually built them.

        One thing that's different about today: the database starts completely empty, and every time you click Run, your whole file runs from the top. So your file will grow into a full recipe: create the tables, add the data, then ask questions. Don't delete earlier steps.

        Let's get set up. Open horizon.dev and click Paws & Keys. On the left you'll see clinic.sql, where we'll write, and clinic.db, our empty database. Click clinic.db. It says there are no tables yet. By the end of class, it'll be full. Drop a 1 in the chat when you're ready.
      `,
      setup: [
        "horizon.dev is open, and Paws & Keys is selected",
        "They can see clinic.sql and clinic.db on the left",
        "They know the whole file runs from the top on every Run, so earlier steps stay",
        "Everyone has dropped a 1 in the chat"
      ]
    },
    steps: [
      {
        minutes: 7,
        talk: T`
          Step one. We're being asked to create a table for owners, with a unique ID, a name and a phone number. So here's what we'll do: make a table called owners with three columns, and set rules for each one. And here's why: a database starts as an empty file. Tables are how we decide what it will hold.

          Type: CREATE TABLE owners, open bracket. Making a new table is always CREATE TABLE, followed by the name you choose.

          Inside the brackets, we list the columns, one per line, separated by commas. Each column gets a name and a type. The type tells the database what kind of value goes there.

          First: owner_id INTEGER PRIMARY KEY, comma. INTEGER means a whole number. PRIMARY KEY means this is the unique ID for each owner. No two owners can ever share it. Think of it like a customer number. Every table we build today will have one, and the other tables will use it to point back to an owner.

          Next: name TEXT NOT NULL, comma. TEXT means words. NOT NULL means it's required. The database won't let anyone save an owner without a name. NULL is SQL's word for empty.

          Last: phone TEXT, with no comma, because it's the last column. Why TEXT and not a number? Phone numbers have dashes, and you never do math with them. Good rule of thumb: if you'll never add it up, it's probably text.

          Close the bracket, add a semicolon. Click Run. You'll see "Table created." Then click clinic.db on the left. There's your first table.
        `,
        lines: [
          ["CREATE TABLE owners (", "Make a new, empty table called owners. The columns go inside the brackets."],
          ["owner_id INTEGER PRIMARY KEY,", "A whole-number ID that's unique for every owner."],
          ["name TEXT NOT NULL,", "Words, and required. NOT NULL means it can't be left empty."],
          ["phone TEXT", "Words, because phone numbers have dashes. No comma after the last column."],
          [");", "Close the column list and end the statement."]
        ],
        check: {
          q: "Why is phone stored as TEXT instead of INTEGER?",
          a: "Phone numbers have dashes, can start with zero, and you never do math with them. If you won't add it up, it's usually text."
        },
        watch: [
          "Syntax error near \")\": there's a comma after the last column, phone TEXT,.",
          "\"table owners already exists\": they wrote CREATE TABLE owners twice in the file.",
          "PRIMARY KEY on the wrong column: it belongs on owner_id."
        ],
        recap: "Every table gets columns with types, and one PRIMARY KEY."
      },
      {
        minutes: 8,
        talk: T`
          Step two. We're being asked to create a pets table where each pet points to its owner. So here's what we'll do: give each pet its own ID, a name and a species, plus an owner_id that links to the owners table. And here's why: this link is what makes it a relational database. This is the most important idea in today's class.

          Here's the question to ask yourself: how should a pet remember who its owner is? We could type the owner's name and phone into every pet. But then if Maya has two pets and changes her number, we have to fix it twice. Instead, each pet just stores its owner's ID number. Maya's details stay in one place, the owners table.

          Type: CREATE TABLE pets, open bracket. pet_id INTEGER PRIMARY KEY, comma. That's the pet's own unique ID. name TEXT NOT NULL, comma. species TEXT, comma, for dog, cat, bird. Then owner_id INTEGER, comma. That's the link.

          Last line inside the brackets: FOREIGN KEY, open bracket, owner_id, close bracket, REFERENCES owners, open bracket, owner_id, close bracket. This makes the link official. Read it as: the owner_id in this table refers to the owner_id in the owners table.

          And here's what that buys you. The database will now refuse to save a pet that points to an owner who doesn't exist. It protects your data from mistakes.

          So, the big idea in one sentence: a primary key is a table's own ID, and a foreign key is a pointer to another table's ID. Close the bracket, semicolon, and click Run.
        `,
        lines: [
          ["pet_id INTEGER PRIMARY KEY,", "The pet's own unique ID."],
          ["species TEXT,", "Dog, cat, bird, and so on."],
          ["owner_id INTEGER,", "The ID of this pet's owner. This is the link."],
          ["FOREIGN KEY (owner_id)", "This column points to another table."],
          ["REFERENCES owners(owner_id)", "Specifically, to the owner_id column in the owners table."]
        ],
        check: {
          q: "In your own words, what's the difference between a primary key and a foreign key?",
          a: "A primary key is a table's own unique ID. A foreign key is a column that points to another table's primary key."
        },
        watch: [
          "\"no such table: owners\" later on: the owners table from step 1 was deleted. Keep every step in the file.",
          "FOREIGN KEY line placed outside the brackets: it goes inside, as the last item.",
          "A missing comma after owner_id INTEGER causes a syntax error."
        ],
        recap: "Store the other table's ID, not its details, and mark it as a FOREIGN KEY."
      },
      {
        minutes: 5,
        talk: T`
          Step three. We're being asked to create a visits table where each visit points to a pet, with a date, reason and cost. So here's what we'll do: give each visit its own ID, a pet_id that links to pets, and columns for the details. And here's why: this completes a chain. A visit points to a pet, and a pet points to an owner.

          You already know the pattern from step two, so I'll let you lead a little. What should a visit's first column be? Right, its own ID: visit_id INTEGER PRIMARY KEY.

          Which table does a visit belong to? A pet. So we need pet_id INTEGER.

          Then visit_date TEXT. We'll write dates as year, month, day, like 2026-01-14. Written that way, they sort in the right order even as text.

          Then reason TEXT, and cost REAL. REAL is the type for numbers with decimals, which is what money needs. It's the database version of what Python calls a float.

          Last line: FOREIGN KEY, pet_id, REFERENCES pets, pet_id. Same shape as before, just pointing at pets this time.

          Close the bracket, semicolon, click Run. Now click clinic.db on the left. Three tables. That chain, visits to pets to owners, means we'll be able to follow any visit all the way back to the person who paid for it.
        `,
        lines: [
          ["visit_id INTEGER PRIMARY KEY,", "The visit's own unique ID."],
          ["pet_id INTEGER,", "Which pet came in. This is the link."],
          ["visit_date TEXT,", "The date, written YYYY-MM-DD so it sorts correctly."],
          ["cost REAL,", "A number with decimals, for money."],
          ["FOREIGN KEY (pet_id) REFERENCES pets(pet_id)", "Make the link to the pets table official."]
        ],
        check: {
          q: "How would we find which owner paid for a visit?",
          a: "Follow the chain: the visit's pet_id leads to a pet, and that pet's owner_id leads to the owner."
        },
        watch: [
          "REFERENCES pet(pet_id) without the s: the table is pets.",
          "Using INTEGER for cost loses the cents. Use REAL.",
          "The tables must be created in order: owners, then pets, then visits."
        ],
        recap: "Visits point to pets, pets point to owners. That's a chain."
      },
      {
        minutes: 6,
        talk: T`
          Step four. We're being asked to add four owners to the owners table. So here's what we'll do: write one INSERT statement with four rows of values. And here's why: our tables exist now, but they're completely empty.

          Adding rows is always INSERT INTO, then the table name. Then, in brackets, the columns we're filling in: owner_id, name, phone. Then the word VALUES.

          After VALUES, each set of brackets is one row. The values go in the same order as the columns we listed. So for Maya: 1, 'Maya Robinson', '704-555-0101'. Notice the name and phone are in single quotes, because they're text. The ID is a number, so it has no quotes.

          You can add several rows in one statement. Separate each row with a comma, and only the very last row gets the semicolon. Let's type all four: Maya is 1, Luis is 2, Priya is 3, Derek is 4.

          Now, why do owners go first? Remember the foreign key we set up on pets? A pet has to point to an owner who already exists. So the owners need to be there before any pets arrive. Order matters.

          Click Run. You'll see "4 rows added." Click clinic.db, and the owners table now says 4 rows.
        `,
        lines: [
          ["INSERT INTO owners", "Add new rows to the owners table."],
          ["(owner_id, name, phone)", "The columns we're filling in, in this order."],
          ["VALUES", "The rows of data come next."],
          ["(1, 'Maya Robinson', '704-555-0101'),", "One row. Values match the column order. Text in single quotes."],
          ["...;", "Only the last row ends with a semicolon. The others end with a comma."]
        ],
        check: {
          q: "Why do we add owners before pets?",
          a: "Because of the foreign key. Every pet must point to an owner who already exists."
        },
        watch: [
          "\"UNIQUE constraint failed\": two owners have the same owner_id.",
          "Syntax error: a missing comma between rows, or a comma after the last row instead of a semicolon.",
          "Double quotes around text can cause errors in some databases. Use single quotes."
        ],
        recap: "INSERT INTO a table, list the columns, then VALUES in the same order."
      },
      {
        minutes: 6,
        talk: T`
          Step five. We're being asked to add six pets, each linked to its owner. So here's what we'll do: the same INSERT pattern, where the last value in each row is the owner's ID. And here's why: that number is the link between the two tables.

          Type: INSERT INTO pets, open bracket, pet_id, name, species, owner_id, close bracket, VALUES.

          Now, how do we know which owner number to use? From the owners we just added. Maya is owner 1. So Biscuit, the dog, is 1, 'Biscuit', 'Dog', 1. And Mochi, the cat, also belongs to Maya, so Mochi gets owner 1 too. Pepper belongs to Luis, owner 2. Kiwi the bird belongs to Priya, owner 3. And Luna and Rex both belong to Derek, owner 4.

          Here's the beauty of it. Maya has two pets, but her name and phone number are stored only once. If her number changes, we update one row, and both pets stay connected.

          Now let's try something together, because I want you to see the foreign key protect you. Change Rex's owner to 99 and click Run. The database refuses. It says the foreign key constraint failed, because there's no owner 99. That's the database stopping a mistake before it happens. Now change it back to 4, and run it again.
        `,
        lines: [
          ["INSERT INTO pets (pet_id, name, species, owner_id)", "Add rows to pets, filling these four columns."],
          ["(1, 'Biscuit', 'Dog', 1),", "Pet 1 is Biscuit, a dog, owned by owner 1, Maya."],
          ["(2, 'Mochi', 'Cat', 1),", "Mochi also belongs to Maya, so the last value is 1 again."],
          ["the last number in each row", "The owner_id: the link to the owners table."]
        ],
        check: {
          q: "When we changed Rex's owner to 99, why did the database refuse?",
          a: "The foreign key says every owner_id in pets must exist in owners. There's no owner 99, so it blocked the row."
        },
        watch: [
          "\"FOREIGN KEY constraint failed\" when they didn't mean it: an owner_id isn't 1 to 4.",
          "They forgot to change Rex back to 4 after the demo.",
          "Species in quotes: 'Dog', not Dog."
        ],
        recap: "The ID in each row is the link, and the foreign key keeps it honest."
      },
      {
        minutes: 5,
        talk: T`
          Step six. We're being asked to add eight visits, each linked to a pet. So here's what we'll do: one more INSERT, where the second value in each row is the pet's ID. And here's why: with visits in, the database finally has a history we can ask questions about.

          Type: INSERT INTO visits, open bracket, visit_id, pet_id, visit_date, reason, cost, close bracket, VALUES.

          Look at the second number in each row. That's the pet_id. Pet 1 is Biscuit. And Biscuit shows up three times: a checkup in January, an ear infection in March, and vaccines in April. That's one busy dog.

          The dates are in single quotes, because they're stored as text. And they're written year, month, day, so they'll sort correctly.

          The cost has no quotes, because it's a number, a REAL with decimals.

          Before you run it, here's something to keep in your back pocket. Look at the pet_id numbers in this list: 1, 3, 2, 5, 1, 4, 3, 1. One pet never shows up. Which one? We'll find it with a query at the end of class.

          Click Run. "8 rows added." Our database is full, and now the fun part starts.
        `,
        lines: [
          ["INSERT INTO visits (...)", "Add rows to visits, filling these five columns."],
          ["(1, 1, '2026-01-14', 'Checkup', 65.00),", "Visit 1 was pet 1, Biscuit, on January 14, for a checkup that cost 65."],
          ["'2026-01-14'", "A date as text, written year-month-day."],
          ["65.00", "The cost, a decimal number, with no quotes."]
        ],
        check: {
          q: "Looking only at the pet_id numbers in this list, which pet never had a visit?",
          a: "Pet 6, which is Rex. The pet_ids used are 1, 2, 3, 4 and 5."
        },
        watch: [
          "FOREIGN KEY constraint failed: a pet_id isn't 1 to 6.",
          "Quotes around cost, like '65.00', store it as text. Leave numbers unquoted.",
          "Values in the wrong order: the date must come third, after visit_id and pet_id."
        ],
        recap: "The full chain is in place: owners, pets and visits, all linked."
      },
      {
        minutes: 7,
        talk: T`
          Step seven. We're being asked to list every pet's name next to its owner's name. So here's what we'll do: join the pets table to the owners table, matching on owner_id. And here's why: pet names are in one table, and owner names are in another. We split them up on purpose, and now we need to bring them back together.

          The signal to listen for: any time the answer needs columns from two different tables, that's a JOIN.

          Type: SELECT pets.name AS pet, comma, owners.name AS owner. Why the dots? Both tables have a column called name. If we just wrote name, the database wouldn't know which one we mean. So we write the table name, a dot, then the column. pets.name is the pet's name. owners.name is the owner's name. And AS gives each one a clear label.

          Next line: FROM pets. Then JOIN owners ON pets.owner_id equals owners.owner_id. Semicolon.

          Let's read that last line. JOIN owners says "bring in the owners table too." ON is the matching rule. It says: line up each pet with the owner whose owner_id matches the pet's owner_id. That's the link we built in step two, finally being used.

          Click Run. Six rows, each pet with its owner. Biscuit and Mochi are both next to Maya Robinson.
        `,
        lines: [
          ["pets.name AS pet", "The name column from the pets table, labeled pet."],
          ["owners.name AS owner", "The name column from the owners table, labeled owner."],
          ["FROM pets", "Start with the pets table."],
          ["JOIN owners", "Bring in the owners table too."],
          ["ON pets.owner_id = owners.owner_id", "The matching rule: line up each pet with the owner whose ID matches."]
        ],
        check: {
          q: "Why do we have to write pets.name and owners.name instead of just name?",
          a: "Both tables have a column called name. The table name and dot tell the database which one we mean."
        },
        watch: [
          "\"ambiguous column name: name\": they wrote name without pets. or owners. in front.",
          "24 rows instead of 6: the ON part is missing, so every pet is paired with every owner.",
          "The check asks for the labels pet and owner, using AS."
        ],
        recap: "When the answer lives in two tables, JOIN them ON the ID that links them."
      },
      {
        minutes: 8,
        talk: T`
          Step eight. We're being asked, for each owner, how many visits they've had and how much they've spent, biggest spender first. So here's what we'll do: join owners to pets to visits, group by owner, count the visits and add up the cost. And here's why: "who are our best clients?" is a real question a clinic manager would ask, and it needs all three tables.

          Here's the puzzle. Owner names live in owners. Costs live in visits. But owners and visits don't connect directly. They connect through pets. So we follow the chain, one JOIN at a time.

          Type: SELECT owners.name AS owner, comma. COUNT of visits.visit_id AS visits, comma. SUM of visits.cost AS total_spent.

          Then FROM owners. JOIN pets ON pets.owner_id equals owners.owner_id. That gets us from owners to their pets. Then JOIN visits ON visits.pet_id equals pets.pet_id. That gets us from pets to their visits. Now every visit is connected all the way back to an owner.

          Then GROUP BY owners.owner_id. "For each owner" is our GROUP BY signal. We group by the ID, not the name, because two different owners could have the same name. IDs are always unique.

          Then ORDER BY total_spent DESC, biggest spender first.

          Click Run. Maya is on top, with 4 visits and 455 dollars, across her two pets. We could never get that answer from one table alone.
        `,
        lines: [
          ["COUNT(visits.visit_id) AS visits", "How many visits, for each owner."],
          ["SUM(visits.cost) AS total_spent", "How much they spent in total."],
          ["JOIN pets ON pets.owner_id = owners.owner_id", "Owners to their pets."],
          ["JOIN visits ON visits.pet_id = pets.pet_id", "Pets to their visits. Now visits connect back to owners."],
          ["GROUP BY owners.owner_id", "One group per owner. The ID is safer than the name."],
          ["ORDER BY total_spent DESC", "Biggest spender first."]
        ],
        check: {
          q: "Why do we need two JOINs to get from owners to visits?",
          a: "Owners and visits don't link directly. Visits point to pets, and pets point to owners, so we go through pets."
        },
        watch: [
          "One row only: GROUP BY is missing, so everything is totaled together.",
          "\"no such column\": a table name typo in one of the ON lines, like visit.pet_id instead of visits.pet_id.",
          "Wrong order: DESC is missing."
        ],
        recap: "Follow the chain with one JOIN per link, then GROUP BY."
      },
      {
        minutes: 7,
        talk: T`
          Last step. We're being asked to find the pet that has never had a visit. So here's what we'll do: a LEFT JOIN from pets to visits, then keep only the pets where no visit was found. And here's why: finding what's missing is just as valuable as finding what's there.

          Think about what a normal JOIN does. It only keeps rows that have a match. A pet with no visits has nothing to match, so it just disappears from the results. We'd never even see it.

          That's what LEFT JOIN is for. It keeps every row from the first table, the one on the left, even if there's no match on the other side. So every pet stays, and when a pet has no visit, the visit columns just come back empty. In SQL, empty is called NULL.

          Type: SELECT pets.name AS pet. FROM pets. LEFT JOIN visits ON visits.pet_id equals pets.pet_id. Then WHERE visits.visit_id IS NULL. Semicolon.

          That last line keeps only the pets where no visit was found. And note: it's IS NULL, not equals NULL. That's a special rule in SQL. Equals NULL never matches anything.

          Click Run. And there's Rex, the pet you spotted in step six. In a real clinic, that's a reminder call for a checkup. And in a real business, this exact pattern finds customers who never ordered, or users who signed up and never came back.
        `,
        lines: [
          ["FROM pets", "Start with every pet."],
          ["LEFT JOIN visits", "Bring in visits, but keep every pet even if it has no visits."],
          ["ON visits.pet_id = pets.pet_id", "The matching rule."],
          ["WHERE visits.visit_id IS NULL", "Keep only pets where no visit matched."],
          ["IS NULL", "How SQL checks for empty. = NULL never matches."]
        ],
        check: {
          q: "What would happen if we used a normal JOIN here instead of LEFT JOIN?",
          a: "Rex would disappear, because a normal JOIN only keeps rows that have a match. We'd get zero rows."
        },
        watch: [
          "Zero rows: they used JOIN instead of LEFT JOIN, or = NULL instead of IS NULL.",
          "9 rows: the WHERE line is missing, so every visit shows, plus Rex.",
          "LEFT JOIN with the tables flipped, FROM visits LEFT JOIN pets, finds visits without pets instead."
        ],
        recap: "\"Who never…?\" means LEFT JOIN, then WHERE ... IS NULL."
      }
    ],
    closing: {
      minutes: 6,
      talk: T`
        Let's take a step back. You just built a real database from nothing. You designed three tables. You gave each one a primary key. You connected them with foreign keys. You filled them with data. And you asked questions that needed two and three tables to answer.

        This is exactly how the apps you use every day store their data. So the next time you hear words like primary key, foreign key, JOIN or LEFT JOIN, in a job posting or an interview, you won't just recognize them. You've actually used them.

        If you take away one idea, make it this: store each fact once, in one place, and link everything else to it with IDs. Then JOIN brings it all back together whenever you need it.

        Let's open it up for questions. Unmute or drop them in the chat.
      `,
      homework: [
        "Add a fourth table called vets, and add a vet_id to visits. Then show how many visits each vet handled.",
        "List every visit with the pet's name and the owner's name, using two JOINs.",
        "Find owners who have more than one pet. Hint: GROUP BY owner, then HAVING COUNT(*) > 1."
      ],
      questions: [
        { q: "Why not keep everything in one big table?", a: "You'd repeat the same details over and over, and updating them in one place but not another causes mistakes. Separate tables store each fact once." },
        { q: "Can a foreign key point to any column?", a: "It should point to a column that's unique in the other table, which is almost always that table's primary key." },
        { q: "Is this how big companies do it?", a: "Yes. They have hundreds of tables instead of three, but the ideas are the same: primary keys, foreign keys and JOINs." }
      ],
      next: "That's the end of the series. Go back to any session and try it again with only hints. You'll be surprised how much you remember."
    }
  };

  (window.PROJECTS || []).forEach(p => {
    const c = CLASS[p.id];
    if (!c) return;
    p.lesson = { series: SERIES, session: c.session, opening: c.opening, closing: c.closing };
    p.steps.forEach((s, i) => { if (c.steps[i]) s.lesson = c.steps[i]; });
  });
  window.CLASS_SERIES = SERIES;
})();
