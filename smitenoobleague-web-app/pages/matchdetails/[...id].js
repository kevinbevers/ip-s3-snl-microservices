//default page stuff
import NavBar from 'src/components/NavBar';
import Footer from 'src/components/Footer';

export default function matchdetails({postData}) {
  return (
<>
<NavBar />
{postData}
<Footer />
</>
  );

}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = [
      {
        params: {
          id: ['5234534']
        }
      },
      {
        params: {
          id: ['5234534','game','1']
        }
      },
      {
        params: {
          id: ['5234534','game','2']
        }
      }
    ];
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  const postData = params.id;
  return {
    props: {
      postData
    }
}
}