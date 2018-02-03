from flask import Flask, jsonify, request, render_template
import json

import requests

app = Flask(__name__)

key = 'AIzaSyCl2h6TXkKKYBR8ggKev-IRJOQNCjR1QyY'


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        print(request.form['mot'])
        data = requests.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + request.form['origin'] +
                            '&destination=' +
                            request.form['dest'] +
                            '&mode=' + request.form['mot'].lower() +
                            '&key=' + key)
        resp = data.text
        jsondata = json.loads(resp)
        # print(jsondata)
        routes = list()
        route = dict()
        route["steps"] = list()
        print(len(jsondata["routes"]))
        for r0 in jsondata["routes"]:
            route["summary"] = r0["summary"]
            for r1 in r0["legs"]:

                route["duration"] = r1["duration"]["text"]
                for r2 in r1["steps"]:
                    route["steps"].append(r2["html_instructions"])
                    route["start"]=r2["start_location"]
                    route["end"]=r2["end_location"]

        # route=jsondata["routes"][0]["legs"][0]["steps"][0]["html_instructions"]
        # duration=jsondata["routes"][0]["legs"][0]["duration"]["text"]
        # print(route)
        return jsonify(summary=route["summary"], duration=route["duration"], steps=route["steps"],start=route["start"],end=route["end"])
    return render_template('forms.html')

@app.route('/query')
def query():
    data = requests.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + request.args.get('origin') +'&destination=' +request.args.get('dest') +'&mode=' + request.args.get('mode').lower() +'&key=' + key)
    resp = data.text
    jsondata = json.loads(resp)
    print(jsondata)
    
    routes = list()
    route = dict()
    route["steps"] = list()
    print(len(jsondata["routes"]))
    for r0 in jsondata["routes"]:
        route["summary"] = r0["summary"]
        for r1 in r0["legs"]:

            route["duration"] = r1["duration"]["text"]
            for r2 in r1["steps"]:
                route["steps"].append(r2["html_instructions"])

        # route=jsondata["routes"][0]["legs"][0]["steps"][0]["html_instructions"]
        # duration=jsondata["routes"][0]["legs"][0]["duration"]["text"]
        # print(route)
            
    return jsonify(summary=route["summary"], duration=route["duration"], steps=route["steps"])


if __name__ == '__main__':
    app.run(debug=True)
