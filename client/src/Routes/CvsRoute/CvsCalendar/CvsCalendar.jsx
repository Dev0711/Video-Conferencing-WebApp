import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { scheduleData } from '../dummy';
import Header from '../Header/Header';
import { useState } from 'react';

const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

export default function CvsCalendar() {
    const [scheduleObj, setScheduleObj] = useState();

    const change = (args) => {
        scheduleObj.selectedDate = args.value;
        scheduleObj.dataBind();
    };

    const onDragStart = (arg) => {
        // eslint-disable-next-line no-param-reassign
        arg.navigation.enable = true;
    };

    return (
        <div className="w-full p-4 mt-4 bg-orange-50 rounded-3xl">
            <Header category="App" title="Calendar" />
            <PropertyPane>
                <table
                    style={{ width: '100%', background: '#fff7ed' }}
                >
                    <tbody>
                        <tr style={{ height: '50px' }}>
                            <td style={{ width: '100%', textAlign: 'center' }}>
                                <DatePickerComponent
                                    value={new Date(2021, 12, 17)}
                                    showClearButton={false}
                                    placeholder="Current Date"
                                    floatLabelType="Always"
                                    change={change}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </PropertyPane>
            <ScheduleComponent
                height="650px"
                ref={(schedule) => setScheduleObj(schedule)}
                selectedDate={new Date(2021, 0, 10)}
                eventSettings={{ dataSource: scheduleData }}
                dragStart={onDragStart}
            >
                <ViewsDirective>
                    {['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'].map((item) => <ViewDirective key={item} option={item} />)}
                </ViewsDirective>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
            </ScheduleComponent>

        </div>
    );
}
