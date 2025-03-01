from flask import Flask

app = Flask(__name__)

@app.route("/members")
def members():
  return {"members": ["hi", "h2", "h3"]}

if __name__ == "__main__":
  app.run(debug=True)