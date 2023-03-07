from django.shortcuts import render



# Create your views here.
import urllib.request
import urllib.parse
import json

def index(request):
    if request.method == 'POST':
        # allows to add cities with spaces between name ex: new york
        city = urllib.parse.quote_plus(request.POST['city'])
        source = urllib.request.urlopen('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=9370bfcd193975de29b13c6ae439738c').read()
        list_of_data = json.loads(source)
        timezone = list_of_data['timezone']
        # what will be rendered in html
        data = {
            "country_code": str(list_of_data['sys']['country']),
            "coordinate": str(list_of_data['coord']['lat']) + ', ' + str(list_of_data['coord']['lon']),
            "temp":str(list_of_data['main']['temp']) + ' °F',
            "feels_like":str(list_of_data['main']['feels_like']) + ' °F',
            "temp_min":str(list_of_data['main']['temp_min']) + ' °F',
            "temp_max":str(list_of_data['main']['temp_max']) + ' °F',
            "pressure":str(list_of_data['main']['pressure']),
            "humidity":str(list_of_data['main']['humidity']),
            "main":str(list_of_data['weather'][0]['main']),
            "description":str(list_of_data['weather'][0]['description']),
            "timezone":str(timezone),
            "icon":list_of_data['weather'][0]['icon'],
            "city": str(list_of_data['name'])
        }
        print(data)
    else: 
        data = {
            
        }
    return render(request, "main/index.html", data)