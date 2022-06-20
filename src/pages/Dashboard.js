import '../css/style.css';
import {
    SimpleGrid,
} from '@mantine/core';
import {useEffect} from "react";
import {DeviceGamepad, Stars, Sword} from "tabler-icons-react";

function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard - La 7ème Compagnie";
    }, []);

    return(<>
        <h1>Dashboard</h1>
        <SimpleGrid mt={10} cols={3}>
            <div style={{ boxShadow: 'rgba(0, 0, 0, .4) 0 15px 20px', padding: '0 2rem', borderRadius: '.75rem', height: '150px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', background: 'linear-gradient(140deg, rgba(2,0,36,1) 0%, rgba(8,0,255,1) 100%)' }}>
                <DeviceGamepad size={60}/>
                <p style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{fontSize: '30pt', fontWeight: 900}}>12</span> opérations jouées
                </p>
            </div>
            <div style={{ boxShadow: 'rgba(0, 0, 0, .4) 0 15px 20px', padding: '0 2rem', borderRadius: '.75rem', height: '150px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', background: 'linear-gradient(140deg, rgba(8,0,255,1) 0%, rgba(96,57,128,1) 100%)' }}>
                <Stars size={60}/>
                <p style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{fontSize: '30pt', fontWeight: 900}}>8</span> opérations notées
                </p>
            </div>
            <div style={{ boxShadow: 'rgba(0, 0, 0, .4) 0 15px 20px', padding: '0 2rem', borderRadius: '.75rem', height: '150px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', background: 'linear-gradient(140deg, rgba(96,57,128,1) 0%, rgba(175,0,255,1) 100%)' }}>
                <Sword size={60}/>
                <p style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{fontSize: '30pt', fontWeight: 900}}>2</span> prochaines opérations
                </p>
            </div>
        </SimpleGrid>
    </>);
}

export default Dashboard;
