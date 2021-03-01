from flask import Flask, render_template
from flask import request, url_for, render_template, redirect
import pandas as pd
import numpy as np
import pdb, os

# Create an instance of our Flask app.
app = Flask(__name__)

# Set route
#https://sarahleejane.github.io/learning/python/2015/08/09/simple-tables-in-webapps-using-flask-and-pandas-with-python.html
@app.route('/')
def index():
    print('STARTING! '*20)
    mapbox_access_token = "pk.eyJ1IjoiZGF2aWRjb3kiLCJhIjoiY2tqcHU1YzBzOHY4ZjJxcWpkNGI5b2h2MSJ9.CsPttIW0Q41kP2uOBN6n8g"
    # pdb.set_trace()
    print(os.getcwd())
    # df = pd.read_csv('./static/data/data.csv')
    df = pd.read_csv('./static/data/data.csv')
    #df = df.head(5)
    return render_template('index.html', tables = [df.to_html(classes='female')],
        titles=['IDKLOL'],
        mapbox_access_token=mapbox_access_token)
@app.route('/neighborhood')
def neighborhood():
    return render_template('neighborhood.html')
@app.route('/typesofcrimes')
def crime():
    return render_template('crime.html')
@app.route('/timeofyear')
def year():
    return render_template('Timeofyear.html')




@app.route('/success/<name>')
def success(name):
   return 'welcome %s' % name

@app.route('/prediction', methods = ['POST', 'GET'])
def Prediction():
    if request.method == 'POST':
        pdb.set_trace()
        beat = request.form['beat']
        occur_time = request.form['occur_time']
        neighborhood = request.form['neighborhood']
        location_type = request.form['location_type']
        latitude = request.form['latitude']
        longitude = request.form['longitude']
        year = request.form['year']
        month = request.form['month']
        day = request.form['day']
        dayofweek = request.form['dayofweek']
        pdb.set_trace()
        #return redirect(url_for('success',name = user))
    else:
      #user = request.args.get('nm')
      #return redirect(url_for('success',name = user))
      return render_template('prediction.html')


if __name__ == "__main__":
    app.run(debug=True)
