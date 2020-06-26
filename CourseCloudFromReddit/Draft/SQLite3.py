import sqlite3

# conn = sqlite3.connect(':memory:') # in-memory database
conn = sqlite3.connect('database.db')

c = conn.cursor()

c.execute("""CREATE TABLE employees ()""")


