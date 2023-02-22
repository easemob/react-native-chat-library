import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import {
  createStringSetEn,
  createStringSetFEn,
  messageTimestamp,
  once,
  onceEx,
  seqId,
  timestamp,
  truncateContent,
  truncatedBadgeCount,
  uuid,
} from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

function test1(): void {
  const map: Record<string, string> = {
    'ios.permission.MEDIA_LIBRARY': 'unavailable',
    'ios.permission.PHOTO_LIBRARY': 'granted',
  };
  // Object.values(map).every((value) => {
  //   console.log('test:1:', value);
  //   return true;
  // });

  Object.values(map).every((value, index, arr) => {
    let r = false;
    console.log('test:r:', value, map, index, arr);
    // if (value === 'granted') return true;
    // if (value === 'limited') {
    //   r = true;
    // }
    return r;
  });
}

let count1 = 0;
const o = once(function (c: number) {
  console.log('test:once:', c);
}, ++count1);
const o3 = onceEx((c: number) => {
  console.log('test:once:', c);
});
let count2 = 0;
const o2 = (c: number) => {
  console.log('test:once:', c);
};
function test2(): void {
  o();
}
function test3(): void {
  o2(++count2);
}
function test4(): void {
  o3(++count1);
}

export default function TestUtil() {
  React.useEffect(() => {}, []);

  const getDatePoint = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    // console.log('test:', day, month, year);
    const yesterdayEnd = new Date(year, month, day, 0);
    const yesterMonthEnd = new Date(year, month, 1);
    const yesterYearEnd = new Date(year, 0);
    // console.log(
    //   'test:now:',
    //   now,
    //   'yesterday:',
    //   yesterdayEnd,
    //   'yesterMonth:',
    //   yesterMonthEnd,
    //   'yesterYear:',
    //   yesterYearEnd
    // );
    // console.log(
    //   'test:now:',
    //   now.toLocaleString(),
    //   'yesterday:',
    //   yesterdayEnd.toLocaleString(),
    //   'yesterMonth:',
    //   yesterMonthEnd.toLocaleString(),
    //   'yesterYear:',
    //   yesterYearEnd.toLocaleString()
    // );

    return {
      now: now,
      yesterday: yesterdayEnd,
      yesterMonth: yesterMonthEnd,
      yesterYear: yesterYearEnd,
    };
  };

  const formatDate = (date: Date) => {
    const r = getDatePoint();
    if (date < r.yesterYear) {
      return `${date.getFullYear()}`;
      // return 'long long ago'; // by year, for example: 2023
    } else if (r.yesterYear <= date && date < r.yesterMonth) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
      // return 'yester year'; // by month, for example: 11 month
    } else if (r.yesterMonth <= date && date < r.yesterday) {
      return `yesterday`;
      // return 'yester month'; // by day, for example: 3 month 2 day
    } else if (r.yesterday <= date && date < r.now) {
      return `${date.getHours()}:${date.getMinutes()}`;
      // return 'yester day'; // by time, for example: 12:34
    } else {
      return date.toLocaleString();
    }
  };

  const test5 = () => {
    // now is 2023-02-22T06:59:08.622Z
    const r = getDatePoint();
    const isNowDay = new Date(new Date().setHours(1));
    const isYesterday = new Date(new Date().setDate(21));
    const isYesterMonth = new Date(new Date().setMonth(0));
    const isYesterYear = new Date(new Date().setFullYear(2022));
    console.log(
      'test:',
      r,
      '======',
      isNowDay.toLocaleString(),
      '======',
      isYesterday.toLocaleString(),
      '======',
      isYesterMonth.toLocaleString(),
      '======',
      isYesterYear.toLocaleString()
    );

    console.log('test:1:', formatDate(isNowDay));
    console.log('test:2:', formatDate(isYesterday));
    console.log('test:3:', formatDate(isYesterMonth));
    console.log('test:4:', formatDate(isYesterYear));
  };

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            const s2 = createStringSetFEn<{ xxx: { yyy: string } }>({
              xxx: { yyy: 'ls' },
            });
            console.log('test:createStringSetFEn:', s2);
            const s3 = createStringSetEn<{ zz: { name: string } }>({
              zz: { name: 'zs' },
            });
            console.log('test:createStringSetFEn:', s3);
          }}
        >
          createStringSetFEn
        </Button>
      </View>
      <View>
        <RNButton
          title="messageTimestamp"
          onPress={() => {
            console.log('test:messageTimestamp:', messageTimestamp(new Date()));
            test5();
          }}
        >
          messageTimestamp
        </RNButton>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            console.log('test:truncatedBadgeCount:', truncatedBadgeCount(567));
          }}
        >
          truncatedBadgeCount
        </Button>
      </View>
      <View>
        <RNButton
          title="truncateContent"
          onPress={() => {
            console.log(
              'test:truncateContent:',
              truncateContent({
                content:
                  'jsldifjslekjfsoiejf;lseijf;soeifjs;elfijas;efiljas;elfijase;lfiasje;fliasjefl;asijefse;fijse;lfseijf;lisejf;laseifja;lseifj;asleifj',
              })
            );
          }}
        >
          truncateContent
        </RNButton>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            console.log('test:timestamp:', timestamp());
          }}
        >
          timestamp
        </Button>
      </View>
      <View>
        <RNButton
          title="seqId"
          onPress={() => {
            console.log('test:seqId:', seqId());
          }}
        >
          seqId
        </RNButton>
      </View>
      <View>
        <RNButton
          title="seqId:my"
          onPress={() => {
            console.log('test:seqId:my:', seqId('my'));
          }}
        >
          seqId
        </RNButton>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            console.log('test:uuid:', uuid());
          }}
        >
          uuid
        </Button>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            test1();
          }}
        >
          test1
        </Button>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            test2();
          }}
        >
          test_once
        </Button>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            test3();
          }}
        >
          test_once
        </Button>
      </View>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            test4();
          }}
        >
          test_once
        </Button>
      </View>
    </View>
  );
}
