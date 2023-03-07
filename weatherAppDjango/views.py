from django.shortcuts import render


# Create your views here.
import urllib.request
import json

def index(request):
    if request.method == 'POST':
        city = request.POST['city']
        source = urllib.request.urlopen('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=9370bfcd193975de29b13c6ae439738c').read()
        list_of_data = json.loads(source)
        # what will be rendered in html
        data = {
            "country_code": str(list_of_data['sys']['country']),
            "coordinate":str(list_of_data['coord']['lon']) + ', ' + str(list_of_data['coord']['lat']),
            "temp":str(list_of_data['main']['temp']) + ' °F',
            "feels_like":str(list_of_data['main']['feels_like']) + ' °F',
            "temp_min":str(list_of_data['main']['temp_min']) + ' °F',
            "temp_max":str(list_of_data['main']['temp_max']) + ' °F',
            "pressure":str(list_of_data['main']['pressure']),
            "humidity":str(list_of_data['main']['humidity']),
            "main":str(list_of_data['weather'][0]['main']),
            "description":str(list_of_data['weather'][0]['description']),
            "timezone":str(list_of_data['timezone']),
            "icon":list_of_data['weather'][0]['icon'],
        }
        print(data)
    else: 
        data = {
            
        }
    return render(request, "main/index.html", data)