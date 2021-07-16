import React from "react"
import moment from 'moment'
import Layout from '../components/Layout'


export default function Home() {


  var error = {
    doc_no: '',
    email_id: '',
    tel: '',
    name_value: ''
  }

  var input = {

  }


  var current_date = new Date();
  var month_value = current_date.getMonth() + 1
  var min_date = current_date.getFullYear() + '-' + (month_value > 9 ? '' : '0') + month_value + '-' + current_date.getDate();

  function showDate() {

    document.getElementById('register_date').style.display = 'inline-block'

  }
  function dateChange(e) {
    document.getElementById('no_date_available').style.display = 'block'
    if (e.target.value != "") {
      var day = new Date(e.target.value).getDay()

      if (day == 0) {
        e.target.value = null
        alert('It cannot be sunday')
        document.getElementById('no_date_available').style.display = 'none'
        document.getElementById('timeData').style.display = "none"
      }
      else {
        document.querySelector('.fetching-slots').style.display = "block";
        var item = []

        fetch('https://appointment-image.herokuapp.com/getDetails', {
          method: 'POST',
          body: JSON.stringify({ date_value: document.getElementById('register_date').value }),
          headers: {
            'Content-type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => {

            data = JSON.parse(data['time_value']['body'])
            item.push('<option value="No">Choose time</option>')
            if (data['time_data'].length == 0) {
              document.querySelector('.fetching-slots').style.display = "none";
              document.getElementById('no_date_available').style.display = 'inline-block'
            }
            else {
              document.getElementById('no_date_available').style.display = 'none'
              data['time_data'].forEach((value, index) => {
                item.push('<option value=' + value + '>' + value + '</option>')
                if (index === data['time_data'].length - 1) {
                  document.getElementById('timeData').innerHTML = item.join()
                  document.querySelector('.fetching-slots').style.display = "none";
                  document.getElementById('timeData').style.display = "inline-block"
                  //document.querySelector('#SubmitButton').addEventListener('click',SubmitForm)

                }

              })
            }
          })
      }
    }
    else {
      document.getElementById('no_date_available').style.display = 'none'
      document.getElementById('timeData').style.display = "none"
    }
  }

  function setTime(e) {

  }

  const SubmitForm = () => {
    try {
      if ((error.name_value == '') & (error.tel == '') & (error.email_id == '') & (error.doc_no == '')) {
        var inputs = document.getElementsByTagName('input')
        let file = document.getElementById('upload-image').files[0];
        console.log(inputs);
        var form_input = {
          'hospital': 'FERNANDO',
          'dose_count': document.querySelector('input[name="dose_number"]:checked').value,
          'doc_no': document.getElementById("document_no").value,
          'name': document.getElementById("full-name").value,
          'email': document.getElementById("email").value,
          'tel': document.getElementById("telephone").value,
          'birth_year': document.getElementById("birth_year").value,
          'gender': document.getElementById('gender').value,
          'date_registered': document.getElementById("register_date").value,
          'time_registered': document.getElementById("timeData").value

        }
        form_input.dateRegistered = document.getElementById('dose_name').value
        const formData = new FormData();
        formData.append('hospital', 'FERNANDO');
        formData.append('dose_count', form_input.dose_count);
        formData.append('doc_no', form_input.doc_no);
        formData.append('name', form_input.name);
        formData.append('email', form_input.email);
        formData.append('tel', form_input.tel);
        formData.append('birth_year', form_input.birth_year);
        formData.append('gender', form_input.gender);
        formData.append('file', file);
        formData.append('date_registered', form_input.date_registered);
        formData.append('time_registered', form_input.time_registered);

        if (form_input.dose_count != null) {
          if (form_input.dose_count == 'dose1') {

            if ((form_input.date_registered != "") & (form_input.time_registered != "No") & (form_input.gender != "No") & (form_input.hospital != "No") & (form_input.dose_count != "") & (form_input.doc_no != "") & (form_input.name != "") & (form_input.email != "") & (form_input.tel != "") & (form_input.birth_year != "No")) {
              post_data();
            }
            else {
              alert('Please fill input')
            }
          }
          else {
            form_input.vaccine = document.getElementById('dose_name').value
            form_input.last_vaccine_date = inputs[2].value

            formData.append('vaccine', form_input.vaccine);
            formData.append('last_vaccine_date', form_input.last_vaccine_date);

            if ((form_input.date_registered != "") & (form_input.time_registered != "No") & (form_input.gender != "No") & (file != undefined) & (form_input.hospital != "No") & (form_input.vaccine != "No") & (form_input.last_vaccine_date != "") & (form_input.dose_count != "") & (form_input.doc_no != "") & (form_input.name != "") & (form_input.email != "") & (form_input.tel != "") & (form_input.birth_year != "No")) {
              post_data();
            }
            else {
              alert('Please fill input')
            }

          }
        }
        else {
          alert('Please fill input')
        }
        function post_data() {

          document.querySelector('.cont-2').style.display = 'block';
          fetch('https://appointment-image.herokuapp.com/storeDetails', {
            method: 'POST',
            body: formData,
          })
            .then(response => response.json())
            .then(data => {
              if ((data['statusCode'] == 200) | (data['statusCode'] == 403)) {
                if (JSON.parse(data['body'])['message'] === 'Successfully Added')
                  window.location.href = '/complete'
                else {
                  alert('User Already Exist')
                  document.querySelector('.cont-2').style.display = 'none';
                  window.location.href = '/'
                }

              }
              else {
                console.log(data);
                alert('Something went wrong')
              }

            });
        }
        //
      }
      else {
        console.log('Inputs are not correct');
        alert('Please check inputs')
      }
    }
    catch (e) {
      console.log(e)
      alert('Please enter field')
    }
  }

  const CheckIfMonths = () => {

    var check_date = moment(min_date)
    var selected_date_of_last_vaccination = moment(document.getElementById('last_vaccine_date').value)
    var diffDays = check_date.diff(selected_date_of_last_vaccination, 'days')

    if (diffDays < 90) {
      document.getElementById('last_vaccine_date').value = null
      alert('Not enough date passed since last vaccination')
    }
  }


  function AddDoseData(e) {
    if (e.target.value == 'dose2') {

      //document.getElementById('last_vaccine_date').setAttribute('onchange')
      document.getElementById('dose_data').style.display = "block"
      document.getElementById('last_vaccine_date').value = null

    }
    else {
      document.getElementById('dose_data').style.display = "none"
    }

    var years = '';
    for (var i = 1920; i <= moment().format('YYYY') - 18; i++) {
      years = years + `<option value=${i}>${i}</option>`
      if (i == 2003) {
        document.getElementById('birth_year').innerHTML = document.getElementById('birth_year').innerHTML + years
      }
    }

  }

  return (
    <Layout>

      <form id="formData" className="formBackground">
        <section>
          <h4>
            Dose(Is it for your first dose or second dose)<span>*</span>
          </h4>
          <div className="dose">
            <div className="radiobuttons">
              <input
                type="radio"
                name="dose_number"
                value="dose1"
                id="dose1"
                onChange={AddDoseData}
              ></input>
              <label for="dose1">Dose1</label>
            </div>
            <div className="radiobuttons">
              <input
                type="radio"
                name="dose_number"
                value="dose2"
                id="dose2"
                onChange={AddDoseData}
              ></input>
              <label for="dose2">Dose2</label>
            </div>
          </div>

          <div
            className="vaccineSelection"
            id="dose_data"
            style={{ display: "none" }}
          >
            <h4>
              Choose Vaccine(Vaccine which you took as first dose)<span>*</span>
            </h4>
            <select id="dose_name" className="selectOption">
              <option value="No">Choose Vaccine</option>
              <option value="covaxin">Covaxin</option>
              <option value="covishield">Covishield</option>
            </select>
            <h4>
              Last vaccine date(Date of first dose)<span>*</span>
            </h4>
            <input
              className="selectOption"
              type="text"
              name="last_vaccine_date"
              id="last_vaccine_date"
              onBlur={CheckIfMonths}
              placeholder="last vaccination date"
              onFocus={e => {
                e.target.setAttribute("type", "date")
                e.target.setAttribute("max", min_date)
              }}
            ></input>
          </div>
        </section>

        <section>
          <h4>
            Enter Aadhaar number<span>*</span>
          </h4>
          <div>
            <input
              className="inputText"
              type="text"
              name="document_no"
              id="document_no"
              placeholder="Enter Aadhar No"
              onChange={e => {
                var doc_no = e.target.value
                if (e.target.value != null) {
                  var aadhar_regex = /^([0-9]{12})$/
                  if (doc_no.match(aadhar_regex)) {
                    document.getElementById("doc_no_error").style.display =
                      "none"
                    error.doc_no = ""
                  } else {
                    document.getElementById("doc_no_error").style.display =
                      "inline-block"
                    error.doc_no = "Doc not correct"
                  }
                } else {
                  document.getElementById("doc_no_error").style.display = "none"
                }
              }}
            ></input>
            <span id="doc_no_error" style={{ display: "none" }}>
              Aadhar number should be all digits and 12 characters long
            </span>
          </div>
        </section>


        <section>
          <div>
            <h4>
              Full Name(As shown in Aadhaar)<span>*</span>
            </h4>
            <input className="inputText" type="text" id="full-name" name="Name" placeholder="Full Name as per Aadhar" onChange={
              (e) => {
                var name_regex = /^[a-z ,.'-]+$/i
                if (e.target.value != null) {
                  if (!(e.target.value.match(name_regex))) {
                    document.getElementById('invalid_name').style.display = "inline-block"
                    error.name_value = 'Name not correct'
                  }
                  else {
                    document.getElementById('invalid_name').style.display = "none"
                    error.name_value = ''
                  }

                }
                else
                  document.getElementById('invalid_name').style.display = "none"


              }
            }></input>
            <span id="invalid_name" style={{ display: "none" }}>Not a valid name</span>

            <h4>
              Gender<span>*</span>
            </h4>
            <select id="gender">
              <option value="No">Choose Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>

            </select>

            <h4>
              Birth Year<span>*</span>
            </h4>


            <select id="birth_year">
              <option value="No">Choose Birth Year</option>

            </select>

            {/* Register Date */}
            <h4>
              Register Date<span>*</span>
            </h4>

            <input className="inputText" type="text" name="text" id="register_date" onChange={dateChange} onBlur={setTime} placeholder="vaccination date" onFocus={(e) => {
              e.target.setAttribute('type', 'date')
              e.target.setAttribute('min', min_date)
            }

            }></input>
            <div>
              <p id="no_date_available" style={{ display: "none" }}>Sorry, No slots available on this day</p>
              <select id="timeData" style={{ display: "none" }}>


              </select>


            </div>

            <h4>
              Mobile Number<span>*</span>
            </h4>
            <input className="inputText" type="number" id="telephone" name="telephone" placeholder="Mobile Number" onChange={
              (e) => {
                var phone_regex = /^([0-9]{10})$/
                if (e.target.value != null) {
                  if (!(e.target.value.match(phone_regex))) {
                    document.getElementById('invalid_phone').style.display = "inline-block"
                    error.tel = 'Telephone not correct'
                  }
                  else {
                    document.getElementById('invalid_phone').style.display = "none"
                    error.tel = ''
                  }
                }
                else
                  document.getElementById('invalid_phone').style.display = "none"
              }
            }></input>
            <span id="invalid_phone" style={{ display: "none" }}>Phone Number should be all digits and 10 character long</span>



            <h4>
              Email(We will notify you once vaccine is available)<span>*</span>
            </h4>

            <input className="inputText" type="email" id="email" name="Email" placeholder="Email ID" onChange={
              (e) => {
                var mail_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if (e.target.value != null) {
                  if (!(e.target.value.match(mail_regex))) {
                    document.getElementById('invalid_mail').style.display = "inline-block"
                    error.email_id = 'Mail not correct'
                  }
                  else {
                    document.getElementById('invalid_mail').style.display = "none"
                    error.email_id = ''
                  }

                }
                else
                  document.getElementById('invalid_mail').style.display = "none"
              }
            }></input>
            <span id="invalid_mail" style={{ display: "none" }}>Not a valid mail</span>

            <h4>
              Upload Image<span>*</span>
            </h4>
            <input className="inputText" type="file" name="uploadImage" id="upload-image"></input>
          </div>
        </section>
      </form>
      <button className="submitButton" id="SubmitButton" onClick={SubmitForm}>Submit</button>
      {/* Spinner */}
      <div className="cont cont-2" style={{ display: 'none' }}>
        <div className="loader"></div>
        <h2>Please Hold On, Submitting your details...</h2>
      </div>
      <div className="cont fetching-slots" style={{ display: 'none' }}>
        <div className="loader"></div>
        <h2>Please Hold On, fetching free slots on the selected day...</h2>
      </div>
    </Layout>
  )
}