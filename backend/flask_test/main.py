from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, LAN!'

if __name__ == '__main__':
    # Run the app only accessible in the LAN network.
    # Host '0.0.0.0' makes the server available on all network interfaces,
    # including the local network.
    app.run(host='0.0.0.0', port=5000)
