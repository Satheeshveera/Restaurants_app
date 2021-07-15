import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import logo from "./image/istockphoto-1220017909-170667a.jpg"
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import SearchBar from "material-ui-search-bar";
import StarIcon from '@material-ui/icons/Star';
import './style.css'
import axios from 'axios';

const locationarr = [
  { id: "1", value: 'chennai',status:false },
  { id: "2", value: 'Maduari',status:false},
  { id: "3", value: 'Ambur',  status:false },
  { id: "4", value: 'Dindugul',status:false},
  { id: "5", value: 'Vellore',status:false },
];
const daysarr = [
  { id: "1", value: 'Veg', status:false },
  { id: "2", value: 'Non veg' ,status:false},
  { id: "3", value: 'Fruit' ,status:false},
];
const marks = [
  { value: 0,label: '0'},
  {value: 100,label: '100'},
  {value: 200,label: '200'},
  {value: 300,label: '300°C'},
  {value: 400,label: '400'},
  {value: 500,label: '500°C'},
];

const useStyles = makeStyles((theme) => ({
  left_session:{
    padding:theme.spacing(2),
    maxWidth:"100%"
  },
  location:{
    marginTop:theme.spacing(4)
  },
  right_side:{
    padding:theme.spacing(4),
    maxWidth:"100%" 
  },
  sub_header:{
    padding:theme.spacing(2),
    maxWidth:"100%"
  },
  ran_slider:{   
    padding:theme.spacing(3),
  },
  media: {
    height: 140,
  },
  list:{
    marginTop:theme.spacing(2) 
  },
  header:{
    padding:theme.spacing(2),
  },
  header1:{
    fontSize:"20px"
  },  
}));

export default function SearchAppBar() {
  const classes = useStyles();
  const [days,setdays]=useState(daysarr);
  const [location,setLocation]=useState(locationarr);
  const [type, setType] = useState("");
  const [list, setList] = useState("");
  const [filterdata, setfilterdata] = useState([]);
  const [filtername, setFiltername] = useState([]);
  const [value, setValue] = React.useState([20,100]); 
  const [searchvalue,setsearchvalue]=useState("");

  useEffect(() => {
    category()
    sort_list()
  //  funsearch()
  }, []);

// category get
const category =()=>{
  axios.get(`http://localhost:8081`)
  .then(res => {
     
    setType(res.data)
  })
  .catch(err=> {  

  })
}
// sort list
const sort_list =()=>{
  if(days){
    var selectedWeekdays = new Object() 
    days.map(function (value, index1) {
      
      if(value.status == true){       
       selectedWeekdays.category_id=(value.id);  
      }
     });
  }
  if(location){
    var selectedWeekdays1 = [];
    var selectedWeek = new Object()
    location.map(function (value1, index1) {  
      if(value1.status == true){       
        selectedWeekdays1.push(value1.value);
        selectedWeek.city=selectedWeekdays1;          
  
      }
     });
  }
  var get_result = new Object();
  if(selectedWeekdays.category_id){ 
    get_result=selectedWeekdays;
  }
  if(selectedWeek.city){   
    get_result=selectedWeek;
  }   
  var  headers= { 
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'}

  axios.post(`http://localhost:8081/app/filter`,get_result,{headers})
  .then(res => {  
       setList(res.data);
  })
  .catch(err=> { 
  })
}

const chkhandleChange = (prop, event, index, item) => {
  let newArr = [...days];
  days.map((data) => {
    if(event.target.checked === true){
    newArr[index].status = event.target.checked;
    }else{
      newArr[index].status = false;
    }
  });
  setdays(newArr); 
  sort_list()
};
const chkhandleChange1 = (prop, event, index, item) => {
  let newArr = [...location];
  locationarr.map((data) => {
    if(event.target.checked === true){
    newArr[index].status = event.target.checked;
    }else{
      newArr[index].status = false;
    }
  });
  setLocation(newArr); 
  sort_list()
};

const handelefilter=(event)=>{
 const searchword= event.target.value;
var result= list.filter((value)=>{
  return value.food_name.includes(searchword) 
 })
 setfilterdata(result)
}
const getvalue=(ele,value)=>{   
  setFiltername(value.food_name)
  var get_result={};
  get_result.name=value.food_name;
  var  headers= { 
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'}
  axios.post(`http://localhost:8081/searchlist`,get_result,{headers})
  .then(res => {    
       setList(res.data);
  })
  .catch(err=> {   
  })

}
// search
const getsearchvalue=(value)=>{
  var get_result={}
  get_result.name=value
  var  headers= { 
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'}
  axios.post(`http://localhost:8081/search/filter`,get_result,{headers})
  .then(res => {    
       setList(res.data);
  })
  .catch(err=> {
  })
}

function valuetext(value) {
  return `${value}`;
}

// range
const rangevalue=(e,value)=>{  
  setValue(value);
  var get_result={};
  get_result.min=value[0]
  get_result.max=value[1]
  var  headers= { 
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'}
  axios.post(`http://localhost:8081/range/filter`,get_result,{headers})
  .then(res => {
    
       setList(res.data);
  })
  .catch(err=> {

  })
}
  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        {/* hearder session */}
       <Grid item xs={12} sm={12} md={12} lg={12}>
        <Grid container spacing={0}>
           <Grid item xs={12} sm={12} md={8} lg={8}>
                 <Typography className={classes.header} variant="h4" noWrap>
                      RESTAURANT IN INDIA <span className={classes.header1}> / {locationarr.length} Branch</span>  
               </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4} className={classes.header}>
         <SearchBar       
         value={searchvalue} 
         onChange={getsearchvalue}
            />
      </Grid>
      </Grid>
        </Grid>
 
 {/* left side session */}
        <Grid item xs={12} sm={4} md={4} lg={3}>
          <Grid item xs={12} sm={12} md={12} lg={12} className={classes.left_session}>        
          <Grid class="search">
            <input type="search" placeholder="Search food here" class="inputitem"  onChange={handelefilter}></input> </Grid>
                { filterdata.length !=0 &&(
                    <Grid class="data_result"> 
                           {filterdata.length >0 && filterdata.map((value,key)=>{
                             return(     <Typography class="data_item" >
                         <Button onClick={(e)=>getvalue(e,value)}>{value.food_name}</Button>
                            </Typography>
                              )        
                         })}
                </Grid>
         )}
           </Grid>
           <Grid item xs={12} sm={6} md={6} lg={12} className={classes.left_session}>
          <Typography >category</Typography>         
                <FormGroup>
                  {days.length >0 && days.map((item,index) => (    
                        <>       
                      <FormControlLabel
                         control={
                        <Checkbox
                       icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                       checkedIcon={<CheckBoxIcon fontSize="small" />}
                        name={item.id}
                        checked={item.status}
                        onChange={(e) => chkhandleChange("Status",e,index,item)}
                               />
                           }
                           label={item.value}
                           />
                         <Divider variant="middle" />   
                        </>
                         ))}       
        </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={12} className={classes.left_session}>
        <Typography className={classes.location}>Location</Typography>
        <FormGroup>
        {location.length >0 && location.map((item,index) => (    
              <>        
              <FormControlLabel
                         control={
                        <Checkbox
                       icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                       checkedIcon={<CheckBoxIcon fontSize="small" />}
                        name={item.id}
                        checked={item.status}
                        onChange={(e) => chkhandleChange1("Status",e,index,item)}
                               />
                           }
                           label={item.value}
                           />
                          <Divider variant="middle" />
                        </>                        
        ))}  
        </FormGroup>
        </Grid>      
        <Grid item xs={12} sm={6} md={6} lg={12}>
        <Typography id="discrete-slider-custom" gutterBottom  className={classes.ran_slider}>
       select cost
      </Typography>
      <br></br> 
      <Slider
         valueLabelDisplay="on"
        aria-labelledby="track-inverted-range-slider"
        getAriaValueText={valuetext}    
        marks={marks}
      value={value}
        max={500}
        step={50}
        onChange={rangevalue}
      />
        </Grid>     
        </Grid>
      {/* Right side session */}
        <Grid item xs={12} sm={8} md={8} lg={9} className={classes.right_side}>
        <Divider />
        <Grid item xs={6} sm={6} md={8} lg={12} className={classes.sub_header}>      
        <Grid item xs={6} sm={4} md={2} lg={2} >
        sort list
        </Grid>     
      </Grid>        
       
        <Divider />       
        <Grid item xs={12} sm={12} md={12} lg={12} className={classes.list}>
        <Grid container spacing={2}>
        {list.length >0 && list.map((item,index) => (    
              <>  
       <Grid item xs={12} sm={12} md={4} lg={4} >     
        <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={logo}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {item.food_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          It is basically a fish stew made with coconut milk. Fish Molee is not as spicy as traditional Kerala recipes; so the flavour of the fish dominates the stew.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions> 
      <Typography gutterBottom variant="h5" component="h2">
      {item.cost} <span className={classes.header1} >/ Rs </span> 
      </Typography>  
        <Button size="small" color="primary">
          show More
        </Button>
      </CardActions>
    </Card>
        </Grid>
        </>  
             ))}
    
        </Grid>
        </Grid>      
        </Grid>       
      </Grid>      
    </div>
  );
}